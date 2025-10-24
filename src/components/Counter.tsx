import { useState } from 'react'

interface Pumpkin {
	id: number
	x: number
	y: number
}

export default function PumpkinCounter() {
	const [count, setCount] = useState(0)
	const [pumpkins, setPumpkins] = useState<Pumpkin[]>([])

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		setCount((prev) => prev + 1)
		setPumpkins((prev) => [...prev, { id: Date.now(), x, y }])
	}

	return (
		<>
			<style>{`
        .pumpkin-container {
          position: relative;
          width: 100%;
          height: 500px;
          border: 2px solid var(--black-400);
          border-radius: 8px;
          background: var(--white-500);
          cursor: pointer;
          overflow: hidden;
        }

        .counter {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--black-500);
          padding: var(--spacing-xs);
          border-radius: var(--spacing-3xs);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          font-size: var(--text-step--1);
          font-weight: bold;
          color: var(--white-400);
          z-index: 10;
          pointer-events: none;
        }

        .pumpkin {
          position: absolute;
          font-size: var(--text-step-1);
          pointer-events: none;
          animation: pumpkin-appear 0.3s ease-in-out;
          transform: translate(-50%, -50%);
          z-index: 5;
        }

        @keyframes pumpkin-appear {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        .instructions {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: var(--black-400);
          font-size: var(--text-step--2);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

			<div className='pumpkin-container' onClick={handleClick}>
				<div className='counter'>🎃 {count}</div>

				{pumpkins.map((pumpkin) => (
					<div
						key={pumpkin.id}
						className='pumpkin'
						style={{
							left: `${pumpkin.x}px`,
							top: `${pumpkin.y}px`,
						}}
					>
						🎃
					</div>
				))}

				<div className='instructions'>
					Click anywhere to place pumpkins!
				</div>
			</div>
		</>
	)
}
