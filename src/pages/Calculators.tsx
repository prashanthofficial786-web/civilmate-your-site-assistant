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
    <div className="space-y-4">
      <Tabs defaultValue="concrete" className="w-full">
        <TabsList className="w-full h-11 grid grid-cols-3 bg-muted">
          <TabsTrigger value="concrete">Concrete</TabsTrigger>
          <TabsTrigger value="brick">Brick & Plaster</TabsTrigger>
          <TabsTrigger value="steel">Steel</TabsTrigger>
        </TabsList>
        <TabsContent value="concrete" className="mt-4">
          <ConcreteCalc />
        </TabsContent>
        <TabsContent value="brick" className="mt-4">
          <BrickCalc />
        </TabsContent>
        <TabsContent value="steel" className="mt-4">
          <SteelCalc />
        </TabsContent>
      </Tabs>
    </div>
  );
}
