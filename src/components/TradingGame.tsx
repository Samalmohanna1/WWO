import { useState, useEffect } from 'react'

interface GameState {
	currentWord: string
	letters: string[]
	swaps: number
	score: number
	gameOver: boolean
	won: boolean
	message: string
	selectedIndex: number | null
}

const LetterSwapPuzzle: React.FC = () => {
	const wordList = [
		'GHOST',
		'WITCH',
		'SPELL',
		'POTION',
		'SKULL',
		'ZOMBIE',
		'DEMON',
		'HAUNTED',
		'PHANTOM',
		'CREEPY',
		'SPOOKY',
		'TERROR',
		'FRIGHT',
		'CURSED',
		'EVIL',
		'COFFIN',
		'GRAVE',
		'MUMMY',
		'PHANTOM',
		'SINISTER',
	]

	const [gameState, setGameState] = useState<GameState>({
		currentWord: '',
		letters: [],
		swaps: 0,
		score: 0,
		gameOver: false,
		won: false,
		message: 'Starting game...',
		selectedIndex: null,
	})

	const initializeGame = () => {
		const word = wordList[Math.floor(Math.random() * wordList.length)]
		const letters = word.split('')
		const shuffled = [...letters].sort(() => Math.random() - 0.5)

		setGameState({
			currentWord: word,
			letters: shuffled,
			swaps: 0,
			score: 0,
			gameOver: false,
			won: false,
			message:
				'Click two letters to trade their places and spell the word!',
			selectedIndex: null,
		})
	}

	useEffect(() => {
		initializeGame()
	}, [])

	const handleLetterClick = (index: number) => {
		if (gameState.gameOver) return

		if (gameState.selectedIndex === null) {
			setGameState((prev) => ({
				...prev,
				selectedIndex: index,
			}))
		} else {
			const newLetters = [...gameState.letters]
			;[newLetters[gameState.selectedIndex], newLetters[index]] = [
				newLetters[index],
				newLetters[gameState.selectedIndex],
			]

			const newSwaps = gameState.swaps + 1
			const isCorrect = newLetters.join('') === gameState.currentWord

			if (isCorrect) {
				const pointsEarned = Math.max(100 - newSwaps * 10, 0)
				setGameState((prev) => ({
					...prev,
					letters: newLetters,
					swaps: newSwaps,
					score: prev.score + pointsEarned,
					won: true,
					gameOver: true,
					message: `🎉 Solved! ${gameState.currentWord} in ${newSwaps} trades! +${pointsEarned} points!`,
					selectedIndex: null,
				}))
			} else {
				setGameState((prev) => ({
					...prev,
					letters: newLetters,
					swaps: newSwaps,
					message: `Trades: ${newSwaps} | Points available: ${Math.max(
						100 - newSwaps * 10,
						0
					)}`,
					selectedIndex: null,
				}))
			}
		}
	}

	const handleNextWord = () => {
		const word = wordList[Math.floor(Math.random() * wordList.length)]
		const letters = word.split('')
		const shuffled = [...letters].sort(() => Math.random() - 0.5)

		setGameState({
			currentWord: word,
			letters: shuffled,
			swaps: 0,
			score: gameState.score,
			gameOver: false,
			won: false,
			message:
				'Click two letters to trade their places and spell the word!',
			selectedIndex: null,
		})
	}

	return (
		<div style={styles.card}>
			<div style={styles.scoreBox}>
				<p style={styles.scoreLabel}>Total Score:</p>
				<p style={styles.scoreValue}>{gameState.score}</p>
			</div>

			<p style={styles.message}>{gameState.message}</p>

			<div style={styles.puzzleContainer}>
				<div style={styles.lettersGrid}>
					{gameState.letters.map((letter, i) => (
						<button
							key={i}
							onClick={() => handleLetterClick(i)}
							disabled={gameState.gameOver}
							style={{
								...styles.letterButton,
								...(gameState.selectedIndex === i
									? styles.letterButtonSelected
									: styles.letterButtonDefault),
								...(gameState.gameOver
									? styles.letterButtonDisabled
									: {}),
							}}
						>
							{letter}
						</button>
					))}
				</div>
			</div>
			{gameState.gameOver && (
				<button
					onClick={handleNextWord}
					style={styles.nextButton}
					onMouseEnter={(e) =>
						(e.currentTarget.style.backgroundColor =
							'var(--lime-600)')
					}
					onMouseLeave={(e) =>
						(e.currentTarget.style.backgroundColor =
							'var(--lime-400)')
					}
				>
					Next Word
				</button>
			)}
		</div>
	)
}

const styles = {
	card: {
		display: 'flex',
		flexDirection: 'column',
		gap: 'var(--spacing-3xs)',
		border: '1px solid var(--lavender-400)',
		borderRadius: 'var(--spacing-3xs)',
		padding: 'var(--spacing-m) var(--spacing-2xs)',
	} as React.CSSProperties,

	scoreBox: {
		display: 'flex',
		gap: 'var(--spacing-s)',
		alignItems: 'center',
	} as React.CSSProperties,

	scoreLabel: {
		fontSize: 'var(--text-step--1)',
	} as React.CSSProperties,

	scoreValue: {
		fontSize: 'var(--text-step-0)',
		fontWeight: 'bold',
		color: 'var(--lime-400)',
	} as React.CSSProperties,

	message: {
		fontSize: 'var(--text-step--2)',
	} as React.CSSProperties,

	puzzleContainer: {
		paddingBlock: 'var(--spacing-m)',
	} as React.CSSProperties,

	lettersGrid: {
		display: 'flex',
		gap: 'var(--spacing-2xs)',
		justifyContent: 'center',
	} as React.CSSProperties,

	letterButton: {
		width: '3.5rem',
		height: '3.5rem',
		borderRadius: 'var(--spacing-3xs)',
		fontWeight: 'bold',
		fontSize: '1.125rem',
		transition: 'all 0.2s ease',
		border: 'none',
		cursor: 'pointer',
	} as React.CSSProperties,

	letterButtonDefault: {
		background: 'var(--lavender-300)',
		border: '2px solid var(--lavender-400)',
		color: 'var(--black-500)',
	} as React.CSSProperties,

	letterButtonSelected: {
		backgroundColor: 'var(--orange-400)',
		borderColor: 'var(--orange-500)',
	} as React.CSSProperties,

	letterButtonDisabled: {
		opacity: 0.6,
		cursor: 'not-allowed',
	} as React.CSSProperties,

	nextButton: {
		width: '100%',
		backgroundColor: 'var(--lime-400)',
		color: 'var(--black-500)',
		padding: 'var(--spacing-xs) var(--spacing-2xs)',
		borderRadius: 'var(--spacing-3xs)',
		border: 'none',
		fontWeight: 'bold',
		cursor: 'pointer',
		transition: 'background-color 0.2s ease',
	} as React.CSSProperties,
}

export default LetterSwapPuzzle
