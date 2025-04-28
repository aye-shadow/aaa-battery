import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Book, Users, Clock, Settings, LogOut } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-[#39FF14]/30 shadow-sm">
        <div className="flex items-center gap-2 p-6 border-b border-[#39FF14]/30">
          <BookOpen className="h-6 w-6 text-[#39FF14]" />
          <h1 className="text-xl font-bold text-gray-800">Library System</h1>
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-800 bg-[#39FF14]/10 rounded-md border-l-2 border-[#39FF14]"
          >
            <Book className="h-5 w-5 text-[#39FF14]" />
            <span>Books</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <Users className="h-5 w-5" />
            <span>Members</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <Clock className="h-5 w-5" />
            <span>Loans</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </a>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-[#39FF14]/30">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-2 text-gray-600 hover:text-gray-800"
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Books Collection</h1>
          <p className="text-gray-600">Manage your library inventory</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats cards */}
          <Card className="bg-white border-[#39FF14]/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-800">Total Books</CardTitle>
              <CardDescription>Library inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[#39FF14]">2,543</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#39FF14]/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-800">Available Books</CardTitle>
              <CardDescription>Ready for loan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[#39FF14]">1,832</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#39FF14]/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-800">Books on Loan</CardTitle>
              <CardDescription>Currently borrowed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[#39FF14]">711</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="bg-white border-[#39FF14]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Recent Additions</CardTitle>
              <CardDescription>Books added in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <h3 className="font-medium text-gray-800">The Great Gatsby</h3>
                      <p className="text-sm text-gray-600">F. Scott Fitzgerald</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-[#39FF14]/20 text-[#39FF14] px-2 py-1 rounded-full">Fiction</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
