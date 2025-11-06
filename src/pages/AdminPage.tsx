import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  email: string;
  plan: "basic" | "golden" | "unlimited";
  usage_count: number;
  last_reset_date: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast.success("Admin access granted");
      loadUsers();
    } else {
      toast.error("Invalid password");
    }
  };

  const loadUsers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Load users error:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, newPlan: "basic" | "golden" | "unlimited") => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ plan: newPlan })
        .eq("user_id", userId);

      if (error) throw error;
      
      toast.success("User plan updated");
      loadUsers();
    } catch (error: any) {
      console.error("Update plan error:", error);
      toast.error("Failed to update plan");
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[hsl(25_100%_95%)] to-[hsl(270_80%_95%)] p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>Enter admin password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password"
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(25_100%_95%)] to-[hsl(270_80%_95%)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Panel
            </CardTitle>
            <CardDescription>Manage users and their plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Plan</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Last Reset</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>{profile.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              profile.plan === "unlimited"
                                ? "bg-purple-500"
                                : profile.plan === "golden"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                            }
                          >
                            {profile.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>{profile.usage_count}</TableCell>
                        <TableCell>{profile.last_reset_date}</TableCell>
                        <TableCell>
                          <Select
                            value={profile.plan}
                            onValueChange={(value: "basic" | "golden" | "unlimited") =>
                              updateUserPlan(profile.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="golden">Golden</SelectItem>
                              <SelectItem value="unlimited">Unlimited</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
