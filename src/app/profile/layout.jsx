import NavbarProfile from "@/components/NavbarProfile";

export default function ProfileLayout({ children }) {
  return (
    <div className="container mx-auto">
      <NavbarProfile />
      {children}
    </div>
  );
}
