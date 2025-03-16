import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthContext } from '../../hooks/useAuthContext'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useNavigate } from 'react-router-dom'

const ManageWork = () => {
  const [workAssignments, setWorkAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.userId) return

    const fetchWorkAssignments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/complaints/assigned/${user.userId}`,
        )

        if (Array.isArray(response.data.complaints)) {
          setWorkAssignments(response.data.complaints)
          console.log(response.data.complaints)
        } else {
          setError('Unexpected data format received')
        }
      } catch (err) {
        setError('Failed to fetch work assignments')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkAssignments()
  }, [user?.userId])

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:8001/complaints/${id}`, {
        status: newStatus,
      })

      setWorkAssignments((prev) =>
        prev.map((work) =>
          work._id === id ? { ...work, status: newStatus } : work,
        ),
      )
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result

    // Prevent unnecessary updates
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const updatedAssignments = [...workAssignments]
    const [movedItem] = updatedAssignments.splice(source.index, 1)

    // **Update the item's status before inserting it into the new position**
    if (source.droppableId !== destination.droppableId) {
      movedItem.status = destination.droppableId
    }

    updatedAssignments.splice(destination.index, 0, movedItem)

    // **Update state immediately so UI reflects change**
    setWorkAssignments(updatedAssignments)

    // **Call API if status changed**
    if (source.droppableId !== destination.droppableId) {
      updateStatus(movedItem._id, movedItem.status)
    }
  }

  if (loading)
    return <p className="text-center mt-5">Loading work assignments...</p>
  if (error)
    return <p className="text-red-500 text-center mt-5">{error}</p>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Manage Assigned Work
      </h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {['pending', 'In Progress', 'completed'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[300px]"
                >
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    {status}
                  </h3>
                  {workAssignments
                    .filter((work) => work.status === status)
                    .map((work, index) => (
                      <Draggable
                        key={`${work._id}-${index}`}
                        draggableId={`${work._id}-${index}`} 
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer"
                            onClick={() => navigate(`/worker/work/${work._id}`)}
                          >
                            {work.complaintImage?.url ? (
                              <img
                                src={work.complaintImage.url}
                                alt="Complaint"
                                className="w-full h-40 object-cover rounded-md mb-2"
                              />
                            ) : (
                              <p className="text-gray-500 text-sm">No Image</p>
                            )}
                            <h3 className="text-lg font-semibold">
                              {work.title || 'No Title Available'}
                            </h3>
                            {/* <p className="mt-2 text-gray-700">
                              {work.description || 'No Description Available'}
                            </p> */}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default ManageWork
