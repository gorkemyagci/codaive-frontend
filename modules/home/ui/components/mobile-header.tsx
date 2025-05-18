"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import pageUrls from "@/lib/enums/page-urls";
import { Code2, Menu } from "lucide-react";
import Link from "next/link";


const MobileHeader = ({ navigation, isOpen, setIsOpen }: {
    navigation: { name: string, href: string }[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}) => {
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0">
                <div className="flex h-full flex-col">
                    <SheetHeader className="border-b p-4">
                        <SheetTitle className="flex items-center gap-2">
                            <Code2 className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">Codaive</span>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-1 flex-col justify-between p-4">
                        <div className="flex flex-col gap-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto flex flex-col gap-4">
                            <Link href={pageUrls.AUTH.SIGN_IN} prefetch onClick={() => setIsOpen(false)}>
                                <Button variant="ghost" className="w-full justify-center hover:bg-transparent">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href={pageUrls.AUTH.SIGN_UP} prefetch onClick={() => setIsOpen(false)}>
                                <Button className="w-full rounded-full">
                                    Start Coding
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileHeader;