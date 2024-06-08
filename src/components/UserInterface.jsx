
export default function UserInterface({ editMode, setEditMode }) {
  return (
    <>
      <div className="absolute top-0 z-30 w-full text-gray-300 m-2 flex justify-center">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`backdrop-blur-xl transition-all font-semibold text-xl rounded-xl p-2 ${
            editMode ? "hover:bg-red-200/20" : "hover:bg-white/40"
          }`}>
          {editMode ? "Stop Editing" : "Start Editing"}
        </button>
      </div>
    </>
  );
}