import React, { useState, useEffect } from 'react'

interface PuzzlePiece {
	id: number
	currentPosition: number
	originalPosition: number
}

export default function ScramblePuzzle() {
	const GRID_SIZE = 3
	const TOTAL_PIECES = GRID_SIZE * GRID_SIZE

	const [pieces, setPieces] = useState<PuzzlePiece[]>([])
	const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null)
	const [isComplete, setIsComplete] = useState<boolean>(false)
	const [pieceSize, setPieceSize] = useState<number>(200)

	useEffect(() => {
		scramblePuzzle()
		updatePieceSize()
		window.addEventListener('resize', updatePieceSize)
		return () => window.removeEventListener('resize', updatePieceSize)
	}, [])

	const updatePieceSize = (): void => {
		const containerWidth = Math.min(window.innerWidth - 40, 700)
		const newSize = Math.floor(Math.min(containerWidth / 3, 200))
		setPieceSize(newSize)
	}

	const scramblePuzzle = (): void => {
		const positions = Array.from({ length: TOTAL_PIECES }, (_, i) => i)
		// Fisher-Yates shuffle
		for (let i = positions.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[positions[i], positions[j]] = [positions[j], positions[i]]
		}

		setPieces(
			positions.map((originalPos, currentIndex) => ({
				id: originalPos,
				currentPosition: currentIndex,
				originalPosition: originalPos,
			}))
		)
		setIsComplete(false)
	}

	const handleDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		piece: PuzzlePiece
	): void => {
		setDraggedPiece(piece)
		e.dataTransfer.effectAllowed = 'move'
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	}

	const handleDrop = (
		e: React.DragEvent<HTMLDivElement>,
		targetPosition: number
	): void => {
		e.preventDefault()

		if (!draggedPiece) return

		const newPieces = [...pieces]
		const draggedIndex = newPieces.findIndex(
			(p) => p.id === draggedPiece.id
		)
		const targetIndex = newPieces.findIndex(
			(p) => p.currentPosition === targetPosition
		)

		if (draggedIndex !== -1 && targetIndex !== -1) {
			const temp = newPieces[draggedIndex].currentPosition
			newPieces[draggedIndex].currentPosition =
				newPieces[targetIndex].currentPosition
			newPieces[targetIndex].currentPosition = temp

			setPieces(newPieces)
			checkComplete(newPieces)
		}

		setDraggedPiece(null)
	}

	const checkComplete = (currentPieces: PuzzlePiece[]): void => {
		const complete = currentPieces.every(
			(piece) => piece.currentPosition === piece.originalPosition
		)
		setIsComplete(complete)
	}

	const getPieceAtPosition = (position: number): PuzzlePiece | undefined => {
		return pieces.find((p) => p.currentPosition === position)
	}

	const totalSize = pieceSize * GRID_SIZE

	return (
		<div className='puzzle-container'>
			<style>{`
        .puzzle-container {
          max-width: 620px;
          padding: var(--spacing-3xs);
		  position: relative;
        }
        
        .puzzle-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 0;
          width: ${totalSize}px;
          height: ${totalSize}px;
          background: var(--lavender-500);
        }
        
        .puzzle-slot {
          width: 100%;
          height: 100%;
          border: 1px solid var(--lavender-500);
        }
        
        .puzzle-piece {
          width: 100%;
          height: 100%;
          cursor: grab;
          position: relative;
          background-repeat: no-repeat;
          transition: opacity 0.2s;
        }
        
        .puzzle-piece:active {
          cursor: grabbing;
          opacity: 0.7;
        }
        
        .completion-message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          padding: var(--spacing-s) var(--spacing-m);
          border-radius: var(--spacing-3xs);
          border: 2px solid var(--orange-500);
          z-index: 1000;
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        .message-content {
          color: var(--orange-500);
          font-size: var(--text-step--1);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .scramble-btn {
          padding: var(--spacing-2xs) var(--spacing-s);
          background-color: var(--lavender-400);
          border: none;
          border-radius: var(--spacing-3xs);
          font-weight: 600;
          cursor: pointer;
          transition:
            background 0.2s,
            color 0.2s;
        }
        
        .scramble-btn:hover {
          background-color: var(--lavender-500);
        }
        
        .controls {
          display: flex;
          gap: var(--spacing-l);
          align-items: center;
        }
        
        .heading {
          font-size: var(--text-step--2);
          font-weight: normal;
          padding-block: var(--spacing-xs);
          text-align: center;
        }
      `}</style>
			<div className='controls'>
				<h1 className='heading'>Day 3 Scramble</h1>
				<button onClick={scramblePuzzle} className='scramble-btn'>
					🔀 Scramble Again
				</button>
			</div>

			<div className='puzzle-grid'>
				{Array.from({ length: TOTAL_PIECES }).map((_, position) => {
					const piece = getPieceAtPosition(position)

					if (!piece)
						return (
							<div
								key={position}
								className='puzzle-slot'
								onDragOver={handleDragOver}
								onDrop={(e) => handleDrop(e, position)}
							/>
						)

					const row = Math.floor(piece.originalPosition / GRID_SIZE)
					const col = piece.originalPosition % GRID_SIZE

					return (
						<div
							key={position}
							className='puzzle-slot'
							onDragOver={handleDragOver}
							onDrop={(e) => handleDrop(e, position)}
						>
							<div
								draggable
								onDragStart={(e) => handleDragStart(e, piece)}
								className={`puzzle-piece ${
									isComplete ? 'complete' : ''
								}`}
								style={{
									backgroundImage: `url('https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=600&h=600&fit=crop')`,
									backgroundPosition: `-${
										col * pieceSize
									}px -${row * pieceSize}px`,
									backgroundSize: `${totalSize}px ${totalSize}px`,
								}}
							></div>
						</div>
					)
				})}
			</div>

			{isComplete && (
				<div className='completion-message'>
					<div className='message-content'>
						<p>Have a spooktacular day!</p>
					</div>
				</div>
			)}
		</div>
	)
}
