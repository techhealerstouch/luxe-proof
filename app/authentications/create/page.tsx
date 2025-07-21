"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/searchable-select"
import { DUMMY_WATCHES, type Watch, type WatchAuthentication } from "@/components/watch-data"
import Image from "next/image"

export default function CreateAuthenticationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null)
  const [formData, setFormData] = useState({
    productVerification: "",
    waterResistantTest: "",
    timegraphTest: "",
    description: "",
    verificationImages: ["", "", "", ""],
    accessoryImages: [""],
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleWatchSelect = (watchId: string) => {
    const watch = DUMMY_WATCHES.find((w) => w.id === watchId)
    setSelectedWatch(watch || null)
  }

  const handleImageUpload = (type: "verification" | "accessory", index: number, file: File) => {
    // In a real app, you'd upload to a server and get back a URL
    const imageUrl = URL.createObjectURL(file)

    if (type === "verification") {
      const newImages = [...formData.verificationImages]
      newImages[index] = imageUrl
      setFormData((prev) => ({ ...prev, verificationImages: newImages }))
    } else {
      const newImages = [...formData.accessoryImages]
      newImages[index] = imageUrl
      setFormData((prev) => ({ ...prev, accessoryImages: newImages }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedWatch) {
      alert("Please select a watch")
      return
    }

    const newAuthentication: WatchAuthentication = {
      id: Date.now().toString(),
      watchId: selectedWatch.id,
      watch: selectedWatch,
      productVerification: formData.productVerification as any,
      waterResistantTest: formData.waterResistantTest as any,
      timegraphTest: formData.timegraphTest as any,
      description: formData.description,
      verificationImages: formData.verificationImages.filter((img) => img !== ""),
      accessoryImages: formData.accessoryImages.filter((img) => img !== ""),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("authentications") || "[]")
    existing.push(newAuthentication)
    localStorage.setItem("authentications", JSON.stringify(existing))

    router.push("/authentications")
  }

  // Prepare watch options for searchable select
  const watchOptions = DUMMY_WATCHES.map((watch) => ({
    value: watch.id,
    label: `${watch.brand} ${watch.name} - ${watch.model}`,
    searchTerms:
      `${watch.brand} ${watch.name} ${watch.model} ${watch.referenceNumber} ${watch.serialNumber}`.toLowerCase(),
  }))

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Create Watch Authentication</h2>
          <p className="text-muted-foreground">Add a new watch authentication record</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Watch Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Watch</CardTitle>
              <CardDescription>Choose the watch to authenticate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="watch">Watch</Label>
                <SearchableSelect
                  options={watchOptions}
                  value={selectedWatch?.id}
                  onValueChange={handleWatchSelect}
                  placeholder="Search and select a watch..."
                  searchPlaceholder="Search by brand, model, reference..."
                  emptyMessage="No watches found."
                  className="w-full"
                />
              </div>

              {/* Watch Details Display */}
              {selectedWatch && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Watch Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6">
                      <div className="w-48 h-48 relative rounded-lg overflow-hidden">
                        <Image
                          src={selectedWatch.image || "/placeholder.svg"}
                          alt={`${selectedWatch.brand} ${selectedWatch.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Brand</Label>
                            <p className="text-lg font-semibold">{selectedWatch.brand}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                            <p className="text-lg font-semibold">{selectedWatch.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                            <p className="text-lg">{selectedWatch.model}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Reference Number</Label>
                            <p className="text-lg">{selectedWatch.referenceNumber}</p>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-sm font-medium text-muted-foreground">Serial Number</Label>
                            <p className="text-lg">{selectedWatch.serialNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Select the status for each test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productVerification">Product Verification</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, productVerification: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="servicing">Servicing</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waterResistantTest">Water Resistant Test</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, waterResistantTest: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="servicing">Servicing</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timegraphTest">Timegraph Test</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, timegraphTest: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="servicing">Servicing</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>Provide detailed information about the watch</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter detailed description of the watch condition, history, and any notable features..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Verification Images */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Images</CardTitle>
              <CardDescription>Upload up to 4 images for watch verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="space-y-2">
                    <Label>Image {index + 1}</Label>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      {formData.verificationImages[index] ? (
                        <div className="relative w-full h-24">
                          <Image
                            src={formData.verificationImages[index] || "/placeholder.svg"}
                            alt={`Verification ${index + 1}`}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 py-8">Click to upload</div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload("verification", index, file)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Accessory Images */}
          <Card>
            <CardHeader>
              <CardTitle>Accessory Images</CardTitle>
              <CardDescription>Upload images of boxes, papers, and other peripherals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Accessories Image</Label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {formData.accessoryImages[0] ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={formData.accessoryImages[0] || "/placeholder.svg"}
                        alt="Accessories"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 py-8">Click to upload accessories image</div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload("accessory", 0, file)
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/authentications")}>
              Cancel
            </Button>
            <Button type="submit">Create Authentication</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
