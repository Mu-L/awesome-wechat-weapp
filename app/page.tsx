import Link from "next/link";
import { ArrowRight, Bot, Radar } from "lucide-react";
import { RadarExplorer } from "@/components/radar-explorer";
import { StatStrip } from "@/components/stat-strip";
import { buttonVariants } from "@/components/ui/button";
import { getCategories, getResources, getStats, getUseCases } from "@/lib/resources";

export default async function HomePage() {
  const resources = await getResources();
  const stats = getStats(resources);
  const categories = getCategories(resources);
  const useCases = getUseCases(resources);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-stretch">
        <div className="space-y-5">
          <div className="inline-flex min-h-8 items-center gap-2 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-muted-foreground">
            <Radar aria-hidden="true" className="h-4 w-4 text-primary" />
            AI 驱动的小程序生态选型与风险评估工具
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black leading-tight text-foreground sm:text-5xl">小程序雷达</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              把 awesome 列表升级为可筛选、可评估、可对比的生态情报工具。先基于现有资源库给出推荐状态、风险等级、维护状态和替代方案。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className={buttonVariants()} href="/radar">
              查看雷达
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link className={buttonVariants({ variant: "secondary" })} href="/advisor">
              <Bot aria-hidden="true" className="h-4 w-4" />
              选型顾问
            </Link>
          </div>
        </div>

        <div className="radar-grid rounded-lg border border-border p-5 shadow-radar">
          <div className="border-b border-border pb-4">
            <p className="text-xs font-semibold text-muted-foreground">Radar signal</p>
            <h2 className="mt-2 text-2xl font-bold">从链接清单到技术判断</h2>
          </div>
          <div className="mt-4 grid gap-3 text-sm">
            {[
              ["推荐", "适合新项目优先评估"],
              ["需评估", "需要结合团队和场景验证"],
              ["不建议", "存在停维或迁移风险"]
            ].map(([label, copy]) => (
              <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3 rounded-md border border-border bg-surface/90 p-3" key={label}>
                <span className="font-mono text-sm font-bold text-primary">{label}</span>
                <span className="text-muted-foreground">{copy}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatStrip stats={stats} />
      <RadarExplorer categories={categories} limit={12} resources={resources} useCases={useCases} />
    </div>
  );
}
