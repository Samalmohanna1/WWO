import { useState } from 'react'
import eapImg from '../assets/eap.webp'

interface PoemWords {
	adjective: string
	sound: string
	noun1: string
	noun3: string
	emotion: string
	name: string
}

export default function PoemRemix() {
	const [words, setWords] = useState<PoemWords>({
		adjective: 'midnight',
		sound: 'tapping',
		noun1: 'door',
		noun3: 'floor',
		emotion: 'sorrow',
		name: 'Lenore',
	})

	const handleInputChange = (field: keyof PoemWords, value: string) => {
		setWords((prev) => ({ ...prev, [field]: value }))
	}

	return (
		<div>
			<div className='inputs-grid'>
				<div className='input-group'>
					<label htmlFor='adjective'>Adjective:</label>
					<input
						type='text'
						id='adjective'
						value={words.adjective}
						onChange={(e) =>
							handleInputChange('adjective', e.target.value)
						}
						placeholder='midnight'
					/>
				</div>
				<div className='input-group'>
					<label htmlFor='sound'>Sound:</label>
					<input
						type='text'
						id='sound'
						value={words.sound}
						onChange={(e) =>
							handleInputChange('sound', e.target.value)
						}
						placeholder='tapping'
					/>
				</div>
				<div className='input-group'>
					<label htmlFor='noun1'>Noun (place):</label>
					<input
						type='text'
						id='noun1'
						value={words.noun1}
						onChange={(e) =>
							handleInputChange('noun1', e.target.value)
						}
						placeholder='door'
					/>
				</div>
				<div className='input-group'>
					<label htmlFor='noun3'>Noun (surface):</label>
					<input
						type='text'
						id='noun3'
						value={words.noun3}
						onChange={(e) =>
							handleInputChange('noun3', e.target.value)
						}
						placeholder='floor'
					/>
				</div>
				<div className='input-group'>
					<label htmlFor='emotion'>Emotion:</label>
					<input
						type='text'
						id='emotion'
						value={words.emotion}
						onChange={(e) =>
							handleInputChange('emotion', e.target.value)
						}
						placeholder='sorrow'
					/>
				</div>
				<div className='input-group'>
					<label htmlFor='name'>Name:</label>
					<input
						type='text'
						id='name'
						value={words.name}
						onChange={(e) =>
							handleInputChange('name', e.target.value)
						}
						placeholder='Lenore'
					/>
				</div>
			</div>

			<div className='poem-content'>
				<div className='poem-container'>
					<p className='poem-copy'>
						Once upon a <b>{words.adjective}</b> dreary, while I
						pondered, weak and weary, Over many a quaint and curious
						volume of forgotten lore— While I nodded, nearly
						napping, suddenly there came a <b>{words.sound}</b>, As
						of some one gently rapping, rapping at my chamber{' '}
						<b>{words.noun1}</b>
						"'Tis some visitor," I muttered, "tapping at my chamber{' '}
						<b>{words.noun1}</b>— Only this and nothing more."
					</p>
					<p className='poem-copy'>
						Ah, distinctly I remember it was in the bleak December;
						And each separate dying ember wrought its ghost upon the{' '}
						<b>{words.noun3}</b>. Eagerly I wished the
						morrow;—vainly I had sought to borrow From my books
						surcease of <b>{words.emotion}</b>—
						<b>{words.emotion}</b> for the lost <b>{words.name}</b>—
						For the rare and radiant maiden whom the angels name{' '}
						<b>{words.name}</b>— Nameless here for evermore.
					</p>
					<p className='poem-copy'>
						- Remix of The Raven by Edgar Allan Poe.
					</p>
				</div>
				<img src={eapImg.src} alt='portrait of Edgar Allan Poe.' />
			</div>

			<style>{`
        .inputs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: var(--spacing-s);
          padding-block: var(--spacing-xs);
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3xs);
        }
        .input-group label {
          font-size: var(--text-step--2);
          color: var(--lavender-200);
        }
        .input-group input {
          padding: var(--spacing-3xs) var(--spacing-2xs);
          border: 2px solid var(--lavender-400);
          border-radius: var(--spacing-3xs);
          background-color: var(--lavender-100);
          font-size: var(--text-step--1);
          font-family: 'Courier New', Courier, monospace;
        }
        .input-group input:focus {
          outline: none;
          border-color: var(--lime-600);
        }
        .poem-content {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: var(--spacing-s);
		  padding: var(--spacing-l) var(--spacing-s);
		  border: 4px var(--black-200);
		  border-style: double;
        }
        img {
        max-width: 400px;
          padding-top: var(--spacing-s);
        }
        .poem-copy {
          font-size: var(--text-step-0);
          font-family: 'Courier New', Courier, monospace;
          padding-block: var(--spacing-s);
        }
        b {
          color: var(--black-500);
          background-color: var(--lime-300);
          padding: var(--spacing-3xs);
        }
        @media (max-width: 1000px) {
          .poem-content {
          grid-template-columns: 1fr;
          }
          img {
            max-width: 300px;
            margin-inline: auto;
          }
        }
      `}</style>
		</div>
	)
}
