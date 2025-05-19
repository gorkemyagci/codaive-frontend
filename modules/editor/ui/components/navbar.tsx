import { LayoutGrid, Settings } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between h-10 px-6 border-b backdrop-blur-md relative">
            <div className="w-24" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-foreground">hustily-frontend</div>
            <div className="flex items-center gap-4 ml-auto">
                <LayoutGrid className="size-4 cursor-pointer text-muted-foreground" />
                <Settings className="size-4 cursor-pointer text-muted-foreground" />
            </div>
        </nav>
    );
};

export default Navbar;