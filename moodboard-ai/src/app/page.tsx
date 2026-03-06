"use client";

import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { Upload, Plus, Loader2, StickyNote, X, LayoutGrid, Image as ImageIcon } from "lucide-react";

type BoardItem = {
  id: string;
  type: "image" | "note";
  content: string;
  x: number;
  y: number;
};

// --- COMPONENTE ITEM (Imagens e Notas) ---
const DraggableItem = ({ 
  item, 
  onDelete, 
  onUpdate 
}: { 
  item: BoardItem; 
  onDelete: (id: string) => void;
  onUpdate: (id: string, newContent: string) => void;
}) => {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={{ x: item.x, y: item.y }}>
      <div ref={nodeRef} className="absolute cursor-move group hover:z-50">
        <button 
          onClick={() => onDelete(item.id)}
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:bg-red-600 scale-90 hover:scale-100"
        >
          <X className="w-4 h-4" />
        </button>

        {item.type === "image" ? (
          <div className="bg-white p-2 shadow-sm rounded-xl transition-all group-hover:shadow-2xl border border-transparent group-hover:border-blue-400 w-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.content} alt="moodboard" className="w-full h-auto rounded-lg select-none pointer-events-none" />
          </div>
        ) : (
          <div className="bg-yellow-200 p-4 shadow-md rounded-lg w-56 h-56 rotate-1 hover:rotate-0 transition-transform hover:shadow-xl border border-yellow-300">
            <textarea
              className="w-full h-full bg-transparent resize-none outline-none text-neutral-800 font-handwriting text-lg placeholder-yellow-600/50"
              placeholder="Escreve uma ideia..."
              defaultValue={item.content}
              onBlur={(e) => onUpdate(item.id, e.target.value)}
            />
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default function MoodBoard() {
  const [items, setItems] = useState<BoardItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Estados da Galeria
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

  // --- FUNÇÕES DE LÓGICA ---

  // 1. Buscar imagens à API
  const fetchLibrary = async () => {
    setIsLibraryOpen(true);
    setIsLoadingLibrary(true);
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      if (data.images) {
        setLibraryImages(data.images);
      }
    } catch (error) {
      console.error("Erro a carregar galeria:", error);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  // 2. Adicionar imagem da galeria ao board
  const addFromLibrary = (url: string) => {
    const newItem: BoardItem = {
      id: Date.now().toString(),
      type: "image",
      content: url,
      x: 200 + (Math.random() * 50), // Posição aleatória para não sobrepor
      y: 200 + (Math.random() * 50),
    };
    setItems((prev) => [...prev, newItem]);
    setIsLibraryOpen(false); // Fecha a galeria
  };

  const addNote = () => {
    const newItem: BoardItem = {
      id: Date.now().toString(),
      type: "note",
      content: "",
      x: 100 + (items.length * 20),
      y: 100 + (items.length * 20),
    };
    setItems((prev) => [...prev, newItem]);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, newContent: string) => {
    setItems((prev) => prev.map(item => item.id === id ? { ...item, content: newContent } : item));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        const newItem: BoardItem = {
          id: Date.now().toString(),
          type: "image",
          content: data.url,
          x: 150 + (items.length * 20),
          y: 150 + (items.length * 20),
        };
        setItems((prev) => [...prev, newItem]);
      }
    } catch (error) {
      alert("Erro no upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-neutral-50 overflow-hidden relative dotted-bg font-sans">
      
      {/* --- TOOLBAR --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-xl rounded-2xl px-2 py-2 flex items-center gap-2 z-40 border border-neutral-200">
        
        {/* Upload Button */}
        <label className="cursor-pointer flex items-center gap-2 px-4 py-3 hover:bg-neutral-100 rounded-xl transition-all text-neutral-700 font-medium group relative">
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> : <Upload className="w-5 h-5 text-blue-600" />}
          <span className="text-sm">Upload</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
        </label>

        <div className="w-px h-8 bg-neutral-200 mx-1"></div>

        {/* Library Button (NOVO) */}
        <button 
          onClick={fetchLibrary}
          className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-100 rounded-xl transition-all text-neutral-700 font-medium"
        >
          <LayoutGrid className="w-5 h-5 text-purple-600" />
          <span className="text-sm">Library</span>
        </button>

        <div className="w-px h-8 bg-neutral-200 mx-1"></div>

        {/* Add Note Button */}
        <button 
          onClick={addNote}
          className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-100 rounded-xl transition-all text-neutral-700 font-medium"
        >
          <StickyNote className="w-5 h-5 text-yellow-500" />
          <span className="text-sm">Note</span>
        </button>
      </div>

      {/* --- MODAL DA GALERIA (NOVO) --- */}
      {isLibraryOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-8">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-purple-600" />
                Cloud Library
              </h2>
              <button onClick={() => setIsLibraryOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-neutral-50">
              {isLoadingLibrary ? (
                <div className="flex flex-col items-center justify-center h-40 text-neutral-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p>A carregar imagens do Azure...</p>
                </div>
              ) : libraryImages.length === 0 ? (
                <div className="text-center text-neutral-400 py-10">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>Ainda não tens imagens na Cloud.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {libraryImages.map((url, index) => (
                    <button 
                      key={index} 
                      onClick={() => addFromLibrary(url)}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] focus:ring-2 ring-purple-500 bg-white"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="library item" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Plus className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md transform scale-50 group-hover:scale-100 transition-all duration-300" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- CANVAS --- */}
      <div className="w-full h-full relative">
        {items.length === 0 && !isLibraryOpen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 pointer-events-none">
            <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
              <Plus className="w-8 h-8 opacity-50" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-600">Começa o teu Moodboard</h2>
            <p className="text-sm mt-2">Usa a Library para buscar imagens antigas.</p>
          </div>
        )}

        {items.map((item) => (
          <DraggableItem 
            key={item.id} 
            item={item} 
            onDelete={deleteItem}
            onUpdate={updateItem}
          />
        ))}
      </div>

      <style jsx global>{`
        .dotted-bg {
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .font-handwriting {
          font-family: 'Courier New', Courier, monospace; 
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}