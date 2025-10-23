import { useState } from 'react'

type Color = 'orange' | 'lavender' | 'lime' | 'pink'
type Square = { color: Color; index: number }

const COLORS: Color[] = ['orange', 'lavender', 'lime', 'pink']

export default function MemoryGame() {
	const [sequence, setSequence] = useState<Square[]>([])
	const [userSequence, setUserSequence] = useState<Square[]>([])
	const [isPlaying, setIsPlaying] = useState(false)
	const [isUserTurn, setIsUserTurn] = useState(false)
	const [activeSquare, setActiveSquare] = useState<Square | null>(null)
	const [score, setScore] = useState(0)
	const [gameOver, setGameOver] = useState(false)

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms))

	const playSequence = async (seq: Square[]) => {
		setIsPlaying(true)
		setIsUserTurn(false)

		for (const square of seq) {
			await sleep(400)
			setActiveSquare(square)
			await sleep(600)
			setActiveSquare(null)
		}

		setIsPlaying(false)
		setIsUserTurn(true)
	}

	const startGame = () => {
		const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
		const randomIndex = Math.floor(Math.random() * 4)
		const newSeq = [{ color: randomColor, index: randomIndex }]
		setSequence(newSeq)
		setUserSequence([])
		setScore(0)
		setGameOver(false)
		playSequence(newSeq)
	}

	const addToSequence = () => {
		const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
		const randomIndex = Math.floor(Math.random() * 4)
		const newSeq = [...sequence, { color: randomColor, index: randomIndex }]
		setSequence(newSeq)
		setUserSequence([])
		playSequence(newSeq)
	}

	const handleSquareClick = (color: Color, index: number) => {
		if (!isUserTurn || isPlaying || gameOver) return

		const clickedSquare = { color, index }
		const newUserSeq = [...userSequence, clickedSquare]
		setUserSequence(newUserSeq)

		setActiveSquare(clickedSquare)
		setTimeout(() => setActiveSquare(null), 300)

		const currentStep = newUserSeq.length - 1
		const correctSquare = sequence[currentStep]

		if (
			clickedSquare.color !== correctSquare.color ||
			clickedSquare.index !== correctSquare.index
		) {
			setGameOver(true)
			setIsUserTurn(false)
			return
		}

		if (newUserSeq.length === sequence.length) {
			setScore(score + 1)
			setIsUserTurn(false)
			setTimeout(() => {
				addToSequence()
			}, 1000)
		}
	}

	const getColorStyle = (color: Color, isActive: boolean) => {
		const colors: Record<Color, { base: string; active: string }> = {
			orange: { base: 'var(--orange-800)', active: 'var(--orange-400)' },
			lavender: {
				base: 'var(--lavender-800)',
				active: 'var(--lavender-400)',
			},
			lime: { base: 'var(--lime-800)', active: 'var(--lime-400)' },
			pink: { base: 'var(--pink-800)', active: 'var(--pink-400)' },
		}
		return isActive ? colors[color].active : colors[color].base
	}

	return (
		<div>
			<div className='gameHeader'>
				<button onClick={startGame} className='startBtn'>
					{sequence.length === 0 ? 'Start Game' : 'Restart'}
				</button>
				<p>
					{gameOver ? 'Game Over!' : isUserTurn ? 'Your turn!' : ''}
				</p>
				<p className='score'>Score: {score}</p>
			</div>

			<div className='gameGrid'>
				{COLORS.map((color) => (
					<div key={color} className='colorGrid'>
						{[0, 1, 2, 3].map((i) => {
							const isActive =
								activeSquare?.color === color &&
								activeSquare?.index === i
							const bgColor = getColorStyle(color, isActive)

							return (
								<div
									key={i}
									className='colorBlock'
									style={{
										backgroundColor: bgColor,
										cursor:
											isUserTurn && !isPlaying
												? 'pointer'
												: 'default',
									}}
									onClick={() => handleSquareClick(color, i)}
								/>
							)
						})}
					</div>
				))}
			</div>
			<style>{`
            .gameHeader {
                display: flex;
                gap: var(--spacing-s);
                justify-content: space-between;
                align-items: center;
                padding-block: var(--spacing-s);
                & p {
                font-size: var(--text-step--1);
                }
            }
            .score {
                font-weight: 600;
                color: var(--orange-400);
            }
            .startBtn {
                padding: var(--spacing-2xs) var(--spacing-s);
                background-color: var(--lavender-300);
                color: var(--black-500);
                font-weight: 700;
                border: none;
                border-radius: var(--spacing-3xs);
                cursor: pointer;
            }
            
            .gameGrid {            
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 10px;
				max-width: 600px;
				margin: 0 auto;
            }
            .colorGrid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .colorBlock {
				width: 100%;
                aspect-ratio: 1;
				transition: background-color 0.1s;
            }

            @media (max-width: 500px) {
                .gameHeader {
                    flex-direction: column;
                    gap: var(--spacing-s);
                }
                .gameGrid, .colorGrid {
                    gap: 8px;
                }
            }
        `}</style>
		</div>
	)
}
