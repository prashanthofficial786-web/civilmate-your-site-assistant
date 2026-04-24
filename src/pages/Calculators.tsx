import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConcreteCalc from "@/components/calculators/ConcreteCalc";
import BrickCalc from "@/components/calculators/BrickCalc";
import SteelCalc from "@/components/calculators/SteelCalc";
import { pushRecent } from "@/lib/storage";

export default function Calculators() {
  useEffect(() => {
    pushRecent({ type: "calculator", id: "hub", title: "Calculators" });
  }, []);

  return (
    <div className="space-y-6">
      <div className="px-1">
        <h1 className="text-2xl font-bold text-foreground mb-1">Calculators</h1>
        <p className="text-sm text-muted-foreground font-medium">Instant material estimates for your site.</p>
      </div>

      <Tabs defaultValue="concrete" className="w-full">
        <TabsList className="w-full h-14 p-1.5 bg-muted/50 rounded-[1.5rem] grid grid-cols-3 border border-border/50">
          <TabsTrigger 
            value="concrete" 
            className="rounded-[1.1rem] text-xs font-bold data-[state=active]:bg-[#1C1C1E] data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all"
          >
            Concrete
          </TabsTrigger>
          <TabsTrigger 
            value="brick" 
            className="rounded-[1.1rem] text-xs font-bold data-[state=active]:bg-[#1C1C1E] data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all"
          >
            Brick
          </TabsTrigger>
          <TabsTrigger 
            value="steel" 
            className="rounded-[1.1rem] text-xs font-bold data-[state=active]:bg-[#1C1C1E] data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all"
          >
            Steel
          </TabsTrigger>
        </TabsList>
        <TabsContent value="concrete" className="mt-6">
          <ConcreteCalc />
        </TabsContent>
        <TabsContent value="brick" className="mt-6">
          <BrickCalc />
        </TabsContent>
        <TabsContent value="steel" className="mt-6">
          <SteelCalc />
        </TabsContent>
      </Tabs>
    </div>
  );
}
