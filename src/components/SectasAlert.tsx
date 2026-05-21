import { useState } from 'react';
import { RELIGIOUS_COMPARISONS } from '../data';
import { Shield, Book, Search, Sparkles, BookOpen, Skull, AlertCircle } from 'lucide-react';

export default function SectasAlert() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSecs = RELIGIOUS_COMPARISONS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.founder.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.salvation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.jesus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 md:p-8 bg-slate-900 text-white rounded-2xl border border-slate-850 relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="space-y-3 max-w-3xl">
          <span className="px-3 py-1 text-[10px] font-mono font-bold tracking-widest bg-rose-500/20 text-rose-400 rounded-full border border-rose-500/30 uppercase">
            Recursos de Apologética (Anexo N° 2)
          </span>
          <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-white">
            Análisis de Sectas y Religiones
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Una pauta interactiva basada en el manual <strong className="text-indigo-400 font-semibold">Vida Abundante</strong> para escudriñar y comparar orígenes, doctrinas de resurrección, divinidad de Jesucristo y salvación de las diferentes creencias frente a las Verdades Bíblicas.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filtrar secta, fundador o postura doctrinal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
        />
      </div>

      {/* Interactive Cards Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSecs.map((sect) => (
          <div 
            key={sect.name} 
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-sm transition duration-200 space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-rose-500 shrink-0" />
                  {sect.name}
                </h3>
                <span className="text-[10px] font-mono tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Desviación
                </span>
              </div>

              {/* Founder */}
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-500 font-medium">Fundador:</span>
                <span className="col-span-2 text-slate-800 font-semibold">{sect.founder}</span>
              </div>

              {/* Doctrina Jesús */}
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-500 font-medium">¿Quién es Jesús?:</span>
                <span className="col-span-2 text-slate-700 italic">"{sect.jesus}"</span>
              </div>

              {/* Doctrina Salvación */}
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-500 font-medium">Cómo se salva:</span>
                <span className="col-span-2 text-slate-700">{sect.salvation}</span>
              </div>

              {/* Autoridad */}
              <div className="grid grid-cols-3 text-xs">
                <span className="text-slate-500 font-medium">Mecanismo/Libro:</span>
                <span className="col-span-2 text-slate-600 font-mono font-medium">{sect.authority}</span>
              </div>
            </div>

            {/* Refutación Bíblica */}
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1 mt-auto">
              <div className="flex items-center gap-1.5 text-rose-700 text-xs font-bold leading-none">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Biblia Refutación:
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold italic pl-5">
                Apoyado en {sect.refutation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary Callout */}
      <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-150 font-sans text-xs md:text-sm text-slate-900 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <h4 className="font-bold text-indigo-950 font-sans">Enseñanza Práctica del Discípulo:</h4>
          <p className="leading-relaxed text-slate-700 font-medium font-sans text-sm">
            "No se deje discutir con violencia o encono, mejor muéstrele el amor de Cristo y el cambio que Señor Jesús puede obrar en el individuo. Es por medio del ayuno, la oración y la gracia que se responde sabiamente, sin ser contentor, sino mostrando mansedumbre." (Manual de Discipulado - Pág 24).
          </p>
        </div>
      </div>
    </div>
  );
}
