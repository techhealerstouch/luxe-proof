"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react"
import { type WatchAuthentication, INITIAL_AUTHENTICATIONS } from "@/components/watch-data"
import Link from "next/link"
import Image from "next/image"

export default function AuthenticationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [authentications, setAuthentications] = useState<WatchAuthentication[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load authentications from localStorage or use initial data
    const stored = localStorage.getItem("authentications")
    if (stored) {
      setAuthentications(JSON.parse(stored))
    } else {
      setAuthentications(INITIAL_AUTHENTICATIONS)
      localStorage.setItem("authentications", JSON.stringify(INITIAL_AUTHENTICATIONS))
    }
  }, [user, router])

  const handleDelete = (id: string) => {
    const updated = authentications.filter((auth) => auth.id !== id)
    setAuthentications(updated)
    localStorage.setItem("authentications", JSON.stringify(updated))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "servicing":
        return "bg-yellow-100 text-yellow-800"
      case "reserved":
        return "bg-blue-100 text-blue-800"
      case "sold":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Authentication List</h2>
          <p className="text-muted-foreground">Manage your watch authentication records</p>
        </div>
        <Button asChild>
          <Link href="/authentications/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Authentication
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {authentications.map((auth) => (
          <Card key={auth.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {auth.watch.brand} {auth.watch.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/authentications/edit/${auth.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(auth.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>Model: {auth.watch.model}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={auth.verificationImages[0] || "/placeholder.svg?height=200&width=200"}
                  alt={`${auth.watch.brand} ${auth.watch.name}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Product Verification:</span>
                  <Badge className={getStatusColor(auth.productVerification)}>{auth.productVerification}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Water Resistant:</span>
                  <Badge className={getStatusColor(auth.waterResistantTest)}>{auth.waterResistantTest}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Timegraph:</span>
                  <Badge className={getStatusColor(auth.timegraphTest)}>{auth.timegraphTest}</Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{auth.description}</p>

              <div className="text-xs text-muted-foreground">
                Created: {new Date(auth.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {authentications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">No authentications found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first watch authentication.</p>
              <Button asChild>
                <Link href="/authentications/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Authentication
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
