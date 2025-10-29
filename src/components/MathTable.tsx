import { useState, useEffect, useRef } from 'react'

interface Problem {
	id: number
	num1: number
	num2: number
	answer: number
	userAnswer: string
	timestamp: number
	isDropping: boolean
}

export default function MathTable() {
	const [problems, setProblems] = useState<Problem[]>([])
	const [score, setScore] = useState(0)
	const [gameOver, setGameOver] = useState(false)
	const [gameStarted, setGameStarted] = useState(false)
	const [combo, setCombo] = useState(0)
	const [shakingId, setShakingId] = useState<number | null>(null)
	const [clearingId, setClearingId] = useState<number | null>(null)
	const [nextDropIn, setNextDropIn] = useState(8)
	const nextIdRef = useRef(0)
	const dropIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

	const generateProblem = (): Problem => {
		const num1 = Math.floor(Math.random() * 10) + 1
		const num2 = Math.floor(Math.random() * 10) + 1
		return {
			id: nextIdRef.current++,
			num1,
			num2,
			answer: num1 * num2,
			userAnswer: '',
			timestamp: Date.now(),
			isDropping: true,
		}
	}

	const addNewProblem = () => {
		setProblems((prev) => {
			if (prev.length >= 6) {
				setGameOver(true)
				return prev
			}
			const newProblem = generateProblem()
			setTimeout(() => {
				setProblems((current) =>
					current.map((p) =>
						p.id === newProblem.id ? { ...p, isDropping: false } : p
					)
				)
			}, 1000)

			return [...prev, newProblem]
		})
		setNextDropIn(8)
	}

	const startGame = () => {
		setProblems([])
		setScore(0)
		setCombo(0)
		setGameOver(false)
		setGameStarted(true)
		nextIdRef.current = 0
		setNextDropIn(8)

		setTimeout(() => addNewProblem(), 100)
	}

	const resetGame = () => {
		setProblems([])
		setScore(0)
		setCombo(0)
		setGameOver(false)
		setGameStarted(false)
		setNextDropIn(8)
		if (dropIntervalRef.current) {
			clearInterval(dropIntervalRef.current)
		}
		if (countdownIntervalRef.current) {
			clearInterval(countdownIntervalRef.current)
		}
		startGame()
	}

	useEffect(() => {
		if (!gameStarted || gameOver) return

		countdownIntervalRef.current = setInterval(() => {
			setNextDropIn((prev) => {
				if (prev <= 1) {
					return 8
				}
				return prev - 1
			})
		}, 1000)

		return () => {
			if (countdownIntervalRef.current) {
				clearInterval(countdownIntervalRef.current)
			}
		}
	}, [gameStarted, gameOver])

	useEffect(() => {
		if (!gameStarted || gameOver) return

		dropIntervalRef.current = setInterval(() => {
			addNewProblem()
		}, 8000)

		return () => {
			if (dropIntervalRef.current) {
				clearInterval(dropIntervalRef.current)
			}
		}
	}, [gameStarted, gameOver])

	const calculatePoints = (timeElapsed: number): number => {
		const seconds = timeElapsed / 1000
		if (seconds <= 3) return 100
		if (seconds <= 5) return 75
		if (seconds <= 8) return 50
		return 25
	}

	const handleInputFocus = (id: number) => {
		if (!('ontouchstart' in window)) return

		setTimeout(() => {
			const input = inputRefs.current[id]

			if (input) {
				input.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
			}
		}, 300)
	}

	const handleAnswerChange = (id: number, value: string) => {
		if (value !== '' && !/^\d+$/.test(value)) return

		setProblems((prev) =>
			prev.map((p) => (p.id === id ? { ...p, userAnswer: value } : p))
		)

		const problem = problems.find((p) => p.id === id)
		if (problem && value !== '') {
			const userNum = parseInt(value)
			if (userNum === problem.answer) {
				const timeElapsed = Date.now() - problem.timestamp
				const points = calculatePoints(timeElapsed)
				const comboMultiplier = 1 + combo * 0.5
				const totalPoints = Math.floor(points * comboMultiplier)

				setScore((prev) => prev + totalPoints)
				setCombo((prev) => prev + 1)

				setClearingId(id)
				setTimeout(() => {
					setProblems((prev) => {
						const filtered = prev.filter((p) => p.id !== id)
						// If no problems left, add a new one immediately
						if (filtered.length === 0) {
							setTimeout(() => addNewProblem(), 100)
						}
						return filtered
					})
					setClearingId(null)
				}, 300)
			} else if (value.length >= problem.answer.toString().length) {
				setCombo(0)
				setShakingId(id)
				setTimeout(() => setShakingId(null), 500)
			}
		}
	}

	return (
		<div className='game-container'>
			<style>{`
        .game-container {
          max-width: 600px;
          margin-inline: auto;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-2xs) var(--spacing-s);
        }
        .header-left {
          display: flex;
          gap: var(--spacing-s);
          align-items: center;
        }
        .score-display {
          font-size: var(--text-step--1);
        }
        .combo-display {
          font-size: var(--text-step--2);
          color: var(--orange-300);
        }

        .game-board {
          background: var(--black-500);
          border: 4px double var(--black-300);
          border-radius: var(--spacing-3xs);
          min-height: 450px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .problems-container {
          display: flex;
          flex-direction: column-reverse;
          gap: 0;
          flex: 1;
        }

        .problem-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 2fr;
          align-items: center;
          gap: var(--spacing-2xs);
          padding: var(--spacing-3xs) var(--spacing-s);
          border-top: 2px solid var(--black-300);
          transition: all 0.3s ease;
        }

        .problem-row.dropping {
          animation: dropDown 1s ease-out;
        }

        @keyframes dropDown {
          from {
            transform: translateY(-400px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .problem-row.clearing {
          opacity: 0;
          transform: scale(0.8);
        }

        .problem-row.shaking {
          animation: shake 0.5s;
          background: var(--pink-300);
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .problem-cell {
          text-align: center;
          font-size: var(--text-step-1);
          font-weight: 600;
          color: var(--white-500);
        }

        .problem-input {
          width: 100%;
          max-width: 80px;
          padding: var(--spacing-3xs);
          font-size: var(--text-step-1);
          font-weight: 600;
          text-align: center;
          border: 2px solid var(--lavender-300);
          border-radius: 6px;
          background: var(--white-50);
          color: var(--black-500);
          transition: all 0.2s;
        }

        .problem-input:focus {
          outline: none;
          border-color: var(--lavender-500);
          background: var(--white-50);
          box-shadow: 0 0 0 3px var(--lavender-100);
        }

        .start-screen,
        .game-over-screen {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-l);
		  padding: var(--spacing-s);
        }

        .game-title {
          font-size: var(--text-step-3);
          font-weight: 700;
		  text-align: center;
        }

        .game-instructions {
          font-size: var(--text-step-0);
          text-align: left;
          max-width: 35ch;
          color: var(--black-200);
          & li {
            line-height: 1.2;
            margin-bottom: var(--spacing-2xs);
          }
        }

        .game-button {
          padding: var(--spacing-2xs) var(--spacing-s);
          font-size: var(--text-step-0);
          font-weight: 600;
          color: var(--black-700);
          background: var(--lime-600);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .game-button:hover {
          background: var(--lime-700);
        }

        .final-score {
          font-size: var(--text-step-1);
          color: var(--orange-500);
          font-weight: 700;
		  text-align: center;
        }

        @media (max-width: 640px) {
          .problem-row {
            padding-block: var(--spacing-xs);
          }
          .problem-cell {
            font-size: var(--text-step-0);
          }
          .problem-input {
            max-width: 60px;
            font-size: var(--text-step-0);
          }
        }
      `}</style>

			{!gameStarted ? (
				<div className='game-board'>
					<div className='start-screen'>
						<div className='game-title'>Math Tables 👹</div>
						<ul className='game-instructions'>
							<li>
								Solve multiplication problems before the board
								fills up.
							</li>
							<li>New problems drop every 8 seconds.</li>
							<li>Answer quickly for bonus points.</li>
						</ul>
						<button className='game-button' onClick={startGame}>
							Start Game
						</button>
					</div>
				</div>
			) : gameOver ? (
				<div className='game-board'>
					<div className='game-over-screen'>
						<div className='game-title'>Game Over!</div>
						<div className='final-score'>Final Score: {score}</div>
						<button className='game-button' onClick={resetGame}>
							Play Again
						</button>
					</div>
				</div>
			) : (
				<>
					<div className='game-header'>
						<div className='header-left'>
							<p className='score-display'>Score: {score}</p>
							{combo > 0 && (
								<p className='combo-display'>
									bonus: x{(1 + combo * 0.5).toFixed(1)}
								</p>
							)}
						</div>
						<p>{nextDropIn}</p>
					</div>
					<div className='game-board'>
						<div className='problems-container'>
							{problems.map((problem) => (
								<div
									key={problem.id}
									className={`problem-row ${
										problem.isDropping ? 'dropping' : ''
									} ${
										clearingId === problem.id
											? 'clearing'
											: ''
									} ${
										shakingId === problem.id
											? 'shaking'
											: ''
									}`}
								>
									<p className='problem-cell'>
										{problem.num1}
									</p>
									<p className='problem-cell'>x</p>
									<p className='problem-cell'>
										{problem.num2}
									</p>
									<p className='problem-cell'>=</p>
									<div className='problem-cell'>
										<input
											ref={(el) => {
												inputRefs.current[problem.id] =
													el
											}}
											type='text'
											inputMode='numeric'
											pattern='[0-9]*'
											className='problem-input'
											value={problem.userAnswer}
											onFocus={() =>
												handleInputFocus(problem.id)
											}
											onChange={(e) =>
												handleAnswerChange(
													problem.id,
													e.target.value
												)
											}
											disabled={clearingId === problem.id}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	)
}
