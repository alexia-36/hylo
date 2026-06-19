"use client";

type Props = {
  isOpen: boolean;
  note: string;
  lastUpdated: Date;
  setNote: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
};

//prettier-ignore
export default function NoteForm({ isOpen, note, setNote, onClose, onSave, lastUpdated }: Props) { //functia onClose e pt cancel si atunci in FavPlaceCard se apeleaza o functia care seteaza state-ul isFormOpen la false
  if (!isOpen) return null;

  const formatedUpdatedAt = new Date(lastUpdated).toLocaleString()
  
 
  
   return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="rounded-2xl p-6 w-[90%] max-w-lg bg-linear-to-br from-cyan-500/20 to-blue-900/30 backdrop-blur-xl border border-cyan-900/40 shadow-xl shadow-black/20">
            
            <div className="flex flex-col justify-center items-center ">
              <h3 className="text-white  font-bold mt-3 mb-1">
              Your Note
              </h3>

              <p className="text-sm text-gray-300 mb-3">
                <span className="text-orange-400">Last updated:</span> {formatedUpdatedAt}
              </p> 
            </div>

            <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={6}
            className="w-full rounded-xl p-3 bg-white/10 text-white resize-none outline-none"
            placeholder="Write your thoughts..."
            required
            />

            <div className="flex justify-end gap-3 mb-4">
                {/*cancel btn */}
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-gray-600 text-white cursor-pointer"
                >
                    Cancel
                </button>

                {/*save btn */}
                <button
                    onClick={onSave}
                    className="px-4 py-2 rounded-xl bg-orange-400 hover:bg-amber-600/80   text-white cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg">
                    Save
                </button>

            </div>
      </div>
    </div>
  );

}

{
}
