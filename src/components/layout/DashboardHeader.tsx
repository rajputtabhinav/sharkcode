"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { useClerk, useUser } from "@clerk/nextjs"; // Removed - auth temporarily disabled
import {
    Home,
    Users,
    Wallet,
    User,
    Sparkles,
    LogOut,
    Menu,
    ChevronDown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
    // Temporary: Auth disabled
    const user = null; // { fullName: "Guest User", firstName: "G", imageUrl: "", primaryEmailAddress: { emailAddress: "guest@example.com" } };
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", label: "Home", icon: Home },
        { href: "/refer", label: "Refer", icon: Users },
        { href: "/chat", label: "SharkAI", icon: Sparkles },
        { href: "/withdraw", label: "Withdraw", icon: Wallet },
        { href: "/profile", label: "Profile", icon: User },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-4 max-w-[420px] mx-auto">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-2xl">🦈</span>
                    <span className="font-bold text-white tracking-tight">SharkCode</span>
                </Link>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                            <Avatar className="h-9 w-9 border-2 border-blue-500/30">
                                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                                <AvatarFallback className="bg-blue-600 text-white font-bold">
                                    {user?.firstName?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-200" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-white">{user?.fullName}</p>
                                <p className="text-xs leading-none text-slate-400">{user?.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <DropdownMenuItem key={item.href} asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                    <Link href={item.href} className={`flex items-center ${isActive ? 'text-blue-400' : ''}`}>
                                        <Icon className="mr-2 h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                            className="text-red-400 focus:text-red-300 focus:bg-red-900/20 cursor-pointer"
                            onClick={() => router.push("/")}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out (Disabled)</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
