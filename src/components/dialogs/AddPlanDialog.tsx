import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function AddPlanDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Plan oluşturuldu", description: "Yeni abonelik planı başarıyla eklendi." });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Plan Oluştur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Abonelik Planı</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label>Plan Adı</Label>
              <Input placeholder="Ör: Premium Plus" required />
            </div>
            <div className="space-y-2">
              <Label>Fiyat (₺)</Label>
              <Input type="number" placeholder="149" required />
            </div>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label>Kullanıcı Limiti</Label>
              <Input type="number" placeholder="5" required />
            </div>
            <div className="space-y-2">
              <Label>Cihaz Limiti</Label>
              <Input type="number" placeholder="10" required />
            </div>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label>Veri Saklama (gün)</Label>
              <Input type="number" placeholder="90" required />
            </div>
            <div className="space-y-2">
              <Label>Dönem</Label>
              <Input placeholder="aylık" required />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Özellikler</Label>
            <div className="space-y-2">
              {["SMS Okuma", "Arama Kayıtları", "Keylogger", "Sosyal Medya", "Konum Takibi", "API Erişimi", "Öncelikli Destek"].map((feature) => (
                <div key={feature} className="flex items-center justify-between">
                  <span className="text-sm">{feature}</span>
                  <Switch />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>İptal</Button>
            <Button type="submit">Oluştur</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
