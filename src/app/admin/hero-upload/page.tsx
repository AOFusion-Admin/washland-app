"use client"

import React, { useState } from 'react'

export default function AdminHeroUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [position, setPosition] = useState('right')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return alert('Please choose a file')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('altText', altText)
      fd.append('position', position)
      fd.append('displayOrder', String(displayOrder))
      fd.append('isActive', String(isActive))

      const res = await fetch('/api/admin/hero-upload', {
        method: 'POST',
        body: fd,
      })
      const json = await res.json()
      setResult(json)
      if (!res.ok) throw new Error(json?.error || 'Upload failed')
      // reset form slightly
      setFile(null)
      setAltText('')
    } catch (err: any) {
      alert(err?.message || 'Upload error')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Admin — Upload Hero Image</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Image file</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Alt text</label>
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="mt-1 w-full border px-2 py-1"
            placeholder="Short alt description"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm">Position</label>
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1 w-full border px-2 py-1">
              <option value="left">left</option>
              <option value="right">right</option>
              <option value="center">center</option>
              <option value="background">background</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Display order</label>
            <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="mt-1 w-full border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Active</label>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="mt-2" />
          </div>
        </div>

        <div>
          <button disabled={uploading} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="font-medium">Upload result</h2>
          <pre className="text-sm mt-2">{JSON.stringify(result, null, 2)}</pre>
          {result.imageUrl && (
            <div className="mt-2">
              <img src={result.imageUrl} alt={result.altText || 'hero'} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
