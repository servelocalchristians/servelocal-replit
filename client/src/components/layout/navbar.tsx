import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const isAuthenticated = !!user;
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "flex flex-col space-y-4" : "flex items-baseline space-x-2 sm:space-x-4 lg:space-x-6"}>
      <Link href="/opportunities">
        <button
          className={`${
            isActive("/opportunities") ? "text-primary" : "text-gray-700"
          } hover:text-primary px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap`}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          Find Opportunities
        </button>
      </Link>
      <Link href="/church-dashboard">
        <button
          className={`${
            isActive("/church-dashboard") ? "text-primary" : "text-gray-700"
          } hover:text-primary px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap`}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          For Nonprofits
        </button>
      </Link>
      <Link href="/about">
        <button
          className={`${
            isActive("/about") ? "text-primary" : "text-gray-700"
          } hover:text-primary px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap`}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          About
        </button>
      </Link>
    </div>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-xl sm:text-2xl font-bold text-primary cursor-pointer">
                ServeConnect
              </span>
            </Link>
            <div className="hidden sm:block ml-4 md:ml-6 lg:ml-10">
              <NavLinks />
            </div>
          </div>

          <div className="hidden sm:block">
            {isAuthenticated && user ? (
              <div className="ml-4 flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName || ""} />
                        <AvatarFallback>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="ml-2 sm:ml-4 flex items-center space-x-2 sm:space-x-3">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
                  <a href="/auth">Sign In</a>
                </Button>
                <Button size="sm" className="text-xs sm:text-sm" asChild>
                  <a href="/auth">Get Started</a>
                </Button>
              </div>
            )}
          </div>

          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <>
                <NavLinks mobile />
                {isAuthenticated ? (
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-5">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || ""} />
                        <AvatarFallback>
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => logoutMutation.mutate()}>
                        Log out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 pb-3 border-t border-gray-200 space-y-3">
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/auth">Sign In</a>
                    </Button>
                    <Button className="w-full" asChild>
                      <a href="/auth">Get Started</a>
                    </Button>
                  </div>
                )}
              </>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
