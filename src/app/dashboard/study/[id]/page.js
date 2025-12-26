"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGeneral } from "@/context/generalContext";
import { fetchMaterial, getProgress, saveProgress } from "@/utils/sectionsApi";

function Block({ block }) {
  if (!block) return null;

  if (block.type === "paragraph") {
    return <p className="text-sm leading-6 text-white/85">{block.text}</p>;
  }

  if (block.type === "list") {
    const items = Array.isArray(block.items) ? block.items : [];
    const isNumbered = block.style === "numbered";
    const ListTag = isNumbered ? "ol" : "ul";

    return (
      <ListTag
        className={[
          "ml-5 space-y-2 text-sm text-white/85",
          isNumbered ? "list-decimal" : "list-disc",
        ].join(" ")}
      >
        {items.map((it, idx) => (
          <li key={`${idx}-${String(it).slice(0, 16)}`}>{it}</li>
        ))}
      </ListTag>
    );
  }

  if (block.type === "table") {
    const columns = Array.isArray(block.columns) ? block.columns : [];
    const rows = Array.isArray(block.rows) ? block.rows : [];

    return (
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5">
            <tr>
              {columns.map((c, i) => (
                <th
                  key={`${c}-${i}`}
                  className="whitespace-nowrap px-4 py-3 font-semibold text-white/90"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-t border-white/10">
                {(Array.isArray(r) ? r : []).map((cell, ci) => (
                  <td
                    key={`${ri}-${ci}`}
                    className="align-top px-4 py-3 text-white/80"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function SectionHeading({ title }) {
  return <h2 className="text-lg font-semibold text-white">{title}</h2>;
}

function SubHeading({ title }) {
  return <h3 className="text-sm font-semibold text-white/90">{title}</h3>;
}

function clampInt(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, Math.round(x)));
}

export default function StudyMaterialPage() {
  const { id } = useParams();
  const router = useRouter();
  const { material, setMaterial } = useGeneral();

  const [state, setState] = useState({ loading: true, error: "" });
  const [materialItem, setMaterialItem] = useState(null);

  const progressRef = useRef({
    materialId: "",
    progress: 0,
    lastHeading: "",
    timeSpentSec: 0,
    updatedAt: 0,
  });

  const startTsRef = useRef(Date.now());
  const lastFlushTsRef = useRef(0);

  const data = useMemo(() => {
    if (materialItem?._id) return materialItem;

    const list = Array.isArray(material) ? material : [];
    const target = String(id || "");
    if (!target) return null;

    return list.find((m) => String(m?._id) === target) || null;
  }, [id, material, materialItem]);

  const headings = useMemo(
    () => (Array.isArray(data?.headings) ? data.headings : []),
    [data]
  );

  const progressKey = useMemo(() => {
    const target = String(id || "");
    return target ? `progress:${target}` : "";
  }, [id]);

  const computeProgress = () => {
    const doc = document.documentElement;
    const body = document.body;

    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const scrollHeight = Math.max(
      body.scrollHeight,
      doc.scrollHeight,
      body.offsetHeight,
      doc.offsetHeight,
      body.clientHeight,
      doc.clientHeight
    );
    const clientHeight = window.innerHeight || doc.clientHeight || 0;
    const maxScroll = Math.max(1, scrollHeight - clientHeight);
    const pct = clampInt((scrollTop / maxScroll) * 100, 0, 100);

    return pct;
  };

  const readLocalProgress = () => {
    if (!progressKey) return null;
    try {
      const raw = localStorage.getItem(progressKey);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== "object") return null;
      if (String(obj.materialId || "") !== String(id || "")) return null;
      return obj;
    } catch {
      return null;
    }
  };

  const writeLocalProgress = (patch) => {
    if (!progressKey) return;
    const next = { ...progressRef.current, ...patch };
    progressRef.current = next;
    try {
      localStorage.setItem(progressKey, JSON.stringify(next));
    } catch {}
  };

  const flushProgress = async () => {
    const now = Date.now();
    if (now - lastFlushTsRef.current < 400) return;
    lastFlushTsRef.current = now;

    const payload = readLocalProgress();
    if (!payload?.materialId) return;

    try {
      await saveProgress({
        materialId: payload.materialId,
        progress: payload.progress,
        lastHeading: payload.lastHeading,
        timeSpentSec: payload.timeSpentSec,
        updatedAt: payload.updatedAt,
      });
    } catch {}
  };

  useEffect(() => {
    const target = String(id || "");
    if (!target) {
      setState({ loading: false, error: "Invalid id" });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setState({ loading: true, error: "" });

        const local = readLocalProgress();
        if (local) {
          progressRef.current = local;
        } else {
          progressRef.current = {
            materialId: target,
            progress: 0,
            lastHeading: "",
            timeSpentSec: 0,
            updatedAt: 0,
          };
          writeLocalProgress(progressRef.current);
        }

        const server = await getProgress(target);
        if (!cancelled && server?.materialId) {
          const localUpdated = Number(local?.updatedAt || 0);
          const serverUpdated = new Date(server?.updatedAt || 0).getTime() || 0;

          if (serverUpdated > localUpdated) {
            writeLocalProgress({
              materialId: target,
              progress: clampInt(server.progress ?? 0, 0, 100),
              lastHeading: server.lastHeading || "",
              timeSpentSec: Number(server.timeSpentSec || 0),
              updatedAt: serverUpdated,
            });
          }
        }

        if (!data?._id) {
          const fetched = await fetchMaterial(target);
          if (cancelled) return;

          if (fetched?._id) {
            setMaterialItem(fetched);
            setMaterial((prev) => {
              const list = Array.isArray(prev) ? prev : [];
              if (list.some((m) => String(m?._id) === String(fetched._id)))
                return list;
              return [...list, fetched];
            });
          } else {
            setState({ loading: false, error: "Material not found" });
            return;
          }
        }

        setState({ loading: false, error: "" });
      } catch {
        if (!cancelled) {
          setState({ loading: false, error: "Failed to load study material" });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, data?._id, setMaterial, progressKey]);

  useEffect(() => {
    const target = String(id || "");
    if (!target) return;

    startTsRef.current = Date.now();

    const onScroll = () => {
      const pct = computeProgress();
      const now = Date.now();
      const elapsedSec = Math.floor((now - startTsRef.current) / 1000);

      if (pct < (progressRef.current.progress || 0)) return;

      writeLocalProgress({
        materialId: target,
        progress: pct,
        timeSpentSec: Math.max(
          progressRef.current.timeSpentSec || 0,
          elapsedSec
        ),
        updatedAt: now,
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [id, progressKey]);

  useEffect(() => {
    const target = String(id || "");
    if (!target) return;

    const handleHide = () => {
      flushProgress();
    };

    window.addEventListener("pagehide", handleHide);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") handleHide();
    });

    return () => {
      window.removeEventListener("pagehide", handleHide);
    };
  }, [id]);

  const onBack = async () => {
    await flushProgress();
    router.back();
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 md:px-6 md:py-6">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white/70">
              {data?.topic || ""}
            </div>
            <div className="mt-1 truncate text-xl font-semibold text-white md:text-2xl">
              {data?.title || (state.loading ? "Loading..." : "Not found")}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/60">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                ID: {String(id || "")}
              </span>
              {typeof data?.estimatedMinutes === "number" && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  {data.estimatedMinutes} min
                </span>
              )}
              {data?.level && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  {data.level}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onBack}
            className="shrink-0 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Back
          </button>
        </div>

        {state.error ? (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {state.error}
          </div>
        ) : null}

        {state.loading ? (
          <div className="mt-6 animate-pulse space-y-3">
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-5/6 rounded bg-white/10" />
          </div>
        ) : (
          <>
            {data?.quickSummary?.bullets?.length ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold text-white">
                  Quick Summary
                </div>
                <ul className="ml-5 mt-3 list-disc space-y-2 text-sm text-white/85">
                  {data.quickSummary.bullets.map((b, i) => (
                    <li key={`${i}-${String(b).slice(0, 18)}`}>{b}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-6 space-y-6">
              {headings.map((hItem, hi) => {
                const blocks = Array.isArray(hItem?.blocks) ? hItem.blocks : [];
                const subs = Array.isArray(hItem?.subheadings)
                  ? hItem.subheadings
                  : [];

                return (
                  <div
                    key={`${hi}-${hItem?.h || "heading"}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <SectionHeading title={hItem?.h || ""} />

                    {blocks.length ? (
                      <div className="mt-4 space-y-4">
                        {blocks.map((b, bi) => (
                          <Block
                            key={`${hi}-${bi}-${b?.type || "block"}`}
                            block={b}
                          />
                        ))}
                      </div>
                    ) : null}

                    {subs.length ? (
                      <div className="mt-5 space-y-5">
                        {subs.map((sItem, si) => {
                          const sBlocks = Array.isArray(sItem?.blocks)
                            ? sItem.blocks
                            : [];
                          return (
                            <div
                              key={`${hi}-${si}-${sItem?.h || "sub"}`}
                              className="rounded-xl border border-white/10 bg-black/20 p-4"
                            >
                              <SubHeading title={sItem?.h || ""} />
                              {sBlocks.length ? (
                                <div className="mt-3 space-y-4">
                                  {sBlocks.map((b, bi) => (
                                    <Block
                                      key={`${hi}-${si}-${bi}-${
                                        b?.type || "block"
                                      }`}
                                      block={b}
                                    />
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
