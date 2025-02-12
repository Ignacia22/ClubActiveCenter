/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useMemo } from "react"
import { useAdmin } from "@/context/AdminContext"
import Image from "next/image"
import type { Activity } from "@/interface/IActivity"

export default function ActivitiesPage() {
  const { activities, getAllActivities } = useAdmin()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const availableActivities = useMemo(() => {
    const processActivities = (activities: any): Activity[] => {
      if (Array.isArray(activities)) {
        return activities
      }
      return activities?.activities || []
    }

    const activityList = processActivities(activities)

    return activityList.filter((activity: Activity) => {
      try {
        const activityDate = new Date(activity.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        // Filtrar por fecha y estado
        return activityDate >= today && activity.status !== false
      } catch (err) {
        console.error("Error procesando fecha:", err)
        return false
      }
    })
  }, [])

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true)
        await getAllActivities()
      } catch (err) {
        console.error("Error cargando actividades:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando actividades...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen px-4 sm:px-6 lg:px-8">
        <p className="text-center text-red-500">Error al cargar actividades: {error}</p>
      </div>
    )
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (err) {
      console.error("Error al formatear fecha:", err)
      return dateString
    }
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-black">
      <h1 className="text-center text-3xl font-bold mb-8 text-white">Actividades Disponibles</h1>

      {availableActivities.length === 0 ? (
        <p className="text-center text-gray-500">No hay actividades disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableActivities.map((activity: Activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              {activity.img ? (
                <div className="relative h-48">
                  <Image src={activity.img || "/placeholder.svg"} alt={activity.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{activity.title}</h3>
                  <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">Activa</span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{activity.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Fecha:</span> {formatDate(activity.date)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Hora:</span> {activity.hour}
                    </p>
                  </div>

                  <button className="px-4 py-2 rounded-lg transition-colors bg-blue-500 text-white hover:bg-blue-600">
                    Ver Detalles
                  </button>
                </div>

                <div className="mt-4 text-sm text-gray-500 flex justify-between">
                  <span>Máximo: {activity.maxPeople} personas</span>
                  <span>Registrados: {activity.registeredPeople}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

