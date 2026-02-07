import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Shield, User, UserCog, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddUserDialog } from "@/components/dialogs/AddUserDialog";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { AnimatedSection } from "@/components/AnimatedSection";

const mockUsers = [
  { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", role: "guardian", devices: 3, status: "active", plan: "Premium", lastActive: "2 dk önce" },
  { id: 2, name: "Elif Kaya", email: "elif@example.com", role: "user", devices: 1, status: "active", plan: "Free", lastActive: "15 dk önce" },
  { id: 3, name: "Mehmet Arslan", email: "mehmet@example.com", role: "guardian", devices: 5, status: "active", plan: "Enterprise", lastActive: "1 saat önce" },
  { id: 4, name: "Zeynep Toprak", email: "zeynep@example.com", role: "user", devices: 1, status: "inactive", plan: "Trial", lastActive: "2 gün önce" },
  { id: 5, name: "Can Bulut", email: "can@example.com", role: "user", devices: 2, status: "active", plan: "Premium", lastActive: "30 dk önce" },
  { id: 6, name: "Ayşe Demir", email: "ayse@example.com", role: "guardian", devices: 4, status: "active", plan: "Premium", lastActive: "5 dk önce" },
  { id: 7, name: "Burak Şen", email: "burak@example.com", role: "user", devices: 1, status: "suspended", plan: "Free", lastActive: "1 hafta önce" },
];

const roleLabels: Record<string, { label: string; icon: typeof User }> = {
  guardian: { label: "Guardian", icon: Shield },
  user: { label: "Kullanıcı", icon: User },
  admin: { label: "Admin", icon: UserCog },
};

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Users() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = mockUsers.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kullanıcılar</h1>
            <p className="text-muted-foreground">Tüm kullanıcıları yönetin</p>
          </div>
          <AddUserDialog />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="İsim veya email ara..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Cihaz</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Aktif</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => {
                    const role = roleLabels[user.role] || roleLabels.user;
                    return (
                      <TableRow key={user.id} className="cursor-pointer" onClick={() => navigate(`/users/${user.id}`)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <role.icon className="h-3 w-3" />
                            {role.label}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{user.devices}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{user.plan}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${statusColors[user.status]}`}>
                            {user.status === "active" ? "Aktif" : user.status === "inactive" ? "Pasif" : "Askıda"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
