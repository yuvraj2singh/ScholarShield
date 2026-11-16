'use client'
import { useState } from 'react'
import { Download, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { MONTHLY_DATA, VECTOR_BREAKDOWN, THREAT_PATTERNS } from '@/lib/data'

const QUIZ = [
  {
    q: 'A scholarship emails you saying you\'ve been "pre-selected" and must pay a $95 processing fee to unlock your award. What should you do?',
    options: [
      'Pay the fee — it must be legit if they contacted you',
      'Report it immediately — legitimate scholarships never charge fees',
      'Ask for an invoice before paying',
      'Pay via credit card for protection',
    ],
    answer: 1,
    explain: 'Legitimate scholarships NEVER charge fees. Pre-selection claims combined with payment demands are the #1 advance-fee scam signature.',
  },
  {
    q: 'You find "gates-millenniurnscholars-portal.info" offering the same award as Gates Millennium Scholars. This is likely:',
    options: [
      'A legitimate mirror site',
      'A domain typosquat / homoglyph attack',
      'A regional chapter',
      'A beta application portal',
    ],
    answer: 1,
    explain: 'The hyphen, misspelling of "millennium", and .info TLD are all classic domain mirroring red flags. The real site is gatesmillenniumscholars.org.',
  },
  {
    q: 'An award letter says "Only 3 slots remaining — secure yours in the next 4 hours or lose your placement." This is a:',
    options: [
      'Competitive deadline',
      'Coercive scarcity tactic',
      'Standard admissions notice',
      'FAFSA priority deadline',
    ],
    answer: 1,
    explain: 'Artificial scarcity and countdown timers are classic coercion markers. Real scholarship committees do not use high-pressure sales tactics.',
  },
]

function PatternCard({ p, isOpen, toggle }) {
  return (
    <div className={`border rounded-2xl mb-4 overflow-hidden ${p.color}`}>
      <button onClick={toggle} className="w-full text-left px-6 py-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <span className={`${p.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-md shrink-0 mt-0.5`}>{p.num}</span>
          <div>
            <div className="text-base font-bold text-gray-900 leading-snug mb-1">{p.title}</div>
            <div className="text-xs text-gray-500">{p.sub}</div>
          </div>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-gray-500 shrink-0 mt-1" /> : <ChevronDown size={18} className="text-gray-500 shrink-0 mt-1" />}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-black/5">
          <p className="text-sm text-gray-700 leading-relaxed mt-4 mb-5">{p.desc}</p>

          {p.examples && (
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Fee Examples Catalogued</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {p.examples.map((ex, i) => (
                  <div key={i} className={`rounded-lg p-2.5 text-center border ${
                    ex.risk === 'FRAUD'    ? 'bg-red-50 border-red-200' :
                    ex.risk === 'HIGH_RISK'? 'bg-orange-50 border-orange-200' :
                                            'bg-green-50 border-green-200'
                  }`}>
                    <div className={`text-xs font-bold ${
                      ex.risk === 'FRAUD'    ? 'text-red-700' :
                      ex.risk === 'HIGH_RISK'? 'text-orange-700' :
                                              'text-green-700'
                    }`}>{ex.label}</div>
                    <div className={`text-[10px] mt-0.5 ${
                      ex.risk === 'FRAUD'    ? 'text-red-500' :
                      ex.risk === 'HIGH_RISK'? 'text-orange-500' :
                                              'text-green-500'
                    }`}>{ex.risk.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {p.domains && (
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Domain Mirroring Examples</div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-500 uppercase">Fake Domain</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-500 uppercase">Real Domain</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-gray-500 uppercase">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.domains.map((d, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-3 py-2 font-mono text-red-600 text-[11px]">{d.fake}</td>
                        <td className="px-3 py-2 font-mono text-green-700 text-[11px]">{d.real}</td>
                        <td className="px-3 py-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            d.risk === 'FRAUD' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                          }`}>{d.risk.replace('_', ' ')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function QuizSection() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = QUIZ[current]

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i === q.answer) setScore(s => s + 1)
  }

  function next() {
    if (current + 1 >= QUIZ.length) {
      setDone(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className={`text-5xl font-bold mb-2 tabular-nums ${score === QUIZ.length ? 'text-green-600' : score >= 2 ? 'text-blue-600' : 'text-orange-600'}`}>
          {score}/{QUIZ.length}
        </div>
        <div className="text-sm font-semibold text-gray-800 mb-2">
          {score === QUIZ.length
            ? 'Perfect Score — Threat Analyst Certified!'
            : score >= 2
            ? 'Good — You caught most patterns'
            : 'Keep Learning — Review the patterns above'}
        </div>
        <button
          onClick={() => { setCurrent(0); setSelected(null); setScore(0); setDone(false) }}
          className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-medium px-3 py-2.5 rounded-lg transition-colors bg-white mt-4"
        >
          Retake Quiz
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-semibold text-gray-700">Question {current + 1} of {QUIZ.length}</div>
        <div className="flex gap-1">
          {QUIZ.map((_, i) => (
            <div key={i} className={`w-6 h-1.5 rounded-full ${i < current ? 'bg-blue-700' : i === current ? 'bg-blue-400' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-900 mb-4 leading-relaxed">{q.q}</p>

      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => {
          const isCorrect  = i === q.answer
          const isSelected = i === selected
          const showResult = selected !== null
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className={`w-full text-left text-xs px-4 py-3 rounded-lg border transition-colors ${
                !showResult
                  ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                  : isCorrect
                  ? 'border-green-300 bg-green-50 text-green-800 font-semibold'
                  : isSelected && !isCorrect
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-gray-100 text-gray-400'
              }`}
            >
              <span className="font-mono mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
              {showResult && isCorrect   && <CheckCircle size={12} className="inline ml-2 text-green-600" />}
              {showResult && isSelected && !isCorrect && <XCircle size={12} className="inline ml-2 text-red-500" />}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="text-xs font-bold text-blue-800 mb-1">{selected === q.answer ? '✓ Correct!' : '✗ Incorrect'}</div>
          <div className="text-xs text-blue-700 leading-relaxed">{q.explain}</div>
        </div>
      )}

      {selected !== null && (
        <button
          onClick={next}
          className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          {current + 1 >= QUIZ.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  )
}

export default function ThreatsClient() {
  const [openPattern, setOpenPattern] = useState(null)

  return (
    <div>
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Line chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <div className="text-sm font-bold text-gray-900 mb-1">Monthly Flagging Activity</div>
          <div className="text-xs text-gray-500 mb-4">Flagged vs. Verified scholarships processed per month (2025)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [value, name === 'flagged' ? 'Flagged Scholarships' : 'Verified Scholarships']}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{ fontSize: 12, borderRadius: 10, borderColor: '#e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
              />
              <Line type="monotone" dataKey="flagged"   stroke="#dc2626" strokeWidth={2.5} dot={false} name="Flagged" />
              <Line type="monotone" dataKey="verified"  stroke="#2563eb" strokeWidth={2.5} dot={false} name="Verified" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="text-sm font-bold text-gray-900 mb-1">Threat Vector Breakdown</div>
          <div className="text-xs text-gray-500 mb-4">Distribution of scam tactics detected</div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={VECTOR_BREAKDOWN} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={2} dataKey="value">
                {VECTOR_BREAKDOWN.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {VECTOR_BREAKDOWN.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern accordion */}
      <div className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">The 5 Core Deception Patterns</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
          A comprehensive threat classification of predatory scholarship mechanics, attack taxonomies, and the linguistic and technical deception playbooks that separate genuine academic endowments from predatory lookalike schemes.
        </p>
        {THREAT_PATTERNS.map(p => (
          <PatternCard
            key={p.id}
            p={p}
            isOpen={openPattern === p.id}
            toggle={() => setOpenPattern(openPattern === p.id ? null : p.id)}
          />
        ))}
      </div>

      {/* PDF download banner */}
      <div className="bg-blue-700 rounded-2xl p-7 mb-10 flex items-center justify-between gap-5 flex-wrap">
        <div>
          <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">In-Class Resource</div>
          <div className="text-base sm:text-lg font-bold text-white mb-1.5">Student &amp; Counselor Defense Checklist (The 7 Golden Rules)</div>
          <div className="text-sm text-blue-100 leading-relaxed max-w-xl">
            A one-page high school student or adult-formatted checklist for high school or first-year college students. This can be used directly in class and is printed across 400 participating ScholarShield university-party domains.
          </div>
        </div>
        <button className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 text-sm font-bold px-5 py-3 rounded-xl transition-colors shrink-0 shadow-sm">
          <Download size={16} /> Download Free PDF
        </button>
      </div>

      {/* Quiz */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Interactive Assessment</div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Test Your Detection Skills: Real vs. Deceptive</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">Can you identify the hallmarks of a scholarship scam? Take this 3-question quiz to find out.</p>
        <QuizSection />
      </div>
    </div>
  )
}
