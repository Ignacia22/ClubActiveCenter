export default function AddActivityModal({ onClose }: { onClose: () => void }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-white">Agregar Actividad</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-white">Título</label>
              <input type="text" className="w-full p-2 rounded bg-white" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-white">Descripción</label>
              <textarea className="w-full p-2 rounded bg-white"></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-white">URL de Imagen</label>
              <input type="text" className="w-full p-2 rounded bg-white" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-white">Características (separadas por coma)</label>
              <input type="text" className="w-full p-2 rounded bg-white" />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 text-white hover:text-black hover:bg-slate-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button type="submit" className="bg-blue-600 text-white hover:text-gray-900 hover:bg-cyan-900 px-4 py-2 rounded">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  