import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthContext } from '../../hooks/useAuthContext'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useNavigate } from 'react-router-dom'
import { Loader, AlertCircle, Clock, CheckCircle } from 'lucide-react' // Icons

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
        status: newStatus.toLowerCase(),
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

  // const onDragEnd = (result) => {
  //   if (!result.destination) return;

  //   const { source, destination, draggableId } = result;

  //   if (source.droppableId === destination.droppableId && source.index === destination.index) return;

  //   setWorkAssignments((prev) => {
  //     const copiedTasks = Array.from(prev);
  //     const movedItemIndex = copiedTasks.findIndex((task) => task._id === draggableId);
  //     if (movedItemIndex === -1) return prev;

  //     const movedItem = copiedTasks[movedItemIndex];
  //     copiedTasks.splice(movedItemIndex, 1);

  //     if (source.droppableId !== destination.droppableId) {
  //       movedItem.status = destination.droppableId.toLowerCase();
  //     }

  //     copiedTasks.splice(destination.index, 0, movedItem);
  //     return copiedTasks;
  //   });

  //   if (source.droppableId !== destination.droppableId) {
  //     updateStatus(draggableId, destination.droppableId);
  //   }
  // };

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return

    // Define allowed status order
    const statusOrder = ['pending', 'in progress', 'completed']
    const sourceIndex = statusOrder.indexOf(source.droppableId)
    const destinationIndex = statusOrder.indexOf(destination.droppableId)

    // Prevent moving tasks backward (right to left)
    if (destinationIndex < sourceIndex) return

    // Move item within the UI
    setWorkAssignments((prev) => {
      const copiedTasks = Array.from(prev)
      const movedItemIndex = copiedTasks.findIndex(
        (task) => task._id === draggableId,
      )
      if (movedItemIndex === -1) return prev

      const movedItem = copiedTasks[movedItemIndex]
      copiedTasks.splice(movedItemIndex, 1)

      if (source.droppableId !== destination.droppableId) {
        movedItem.status = destination.droppableId.toLowerCase()
      }

      copiedTasks.splice(destination.index, 0, movedItem)
      return copiedTasks
    })

    // Update status in the backend only if moving forward
    if (source.droppableId !== destination.droppableId) {
      updateStatus(draggableId, destination.droppableId)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="text-red-500 text-lg ml-2">{error}</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Manage Assigned Work
        </h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {['pending', 'in progress', 'completed'].map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-6 rounded-xl shadow-md min-h-[300px] transition-all ${
                      snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-gray-50'
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-6 text-center capitalize flex items-center justify-center">
                      {status === 'pending' ? (
                        <Clock className="h-6 w-6 text-yellow-500 mr-2" />
                      ) : status === 'in progress' ? (
                        <Clock className="h-6 w-6 text-blue-500 mr-2" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      )}
                      {status}
                    </h3>
                    {workAssignments
                      .filter((work) => work.status.toLowerCase() === status)
                      .map((work, index) => (
                        <Draggable
                          key={work._id}
                          draggableId={String(work._id)}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                              onClick={() =>
                                navigate(`/worker/work/${work._id}`)
                              }
                            >
                              {work.complaintImage?.url ? (
                                <img
                                  src={work.complaintImage.url}
                                  alt="Complaint"
                                  className="w-full h-40 object-cover rounded-md mb-3"
                                />
                              ) : (
                                <p className="text-gray-500 text-sm">
                                  No Image
                                </p>
                              )}
                              <h3 className="text-lg font-semibold text-gray-800">
                                {work.title || 'No Title Available'}
                              </h3>
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
    </div>
  )
}

export default ManageWork
