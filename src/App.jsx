import { useState } from 'react'
import NavbarComponent from './components/NavbarComponent'
import SelectTokenModal from './components/SelectTokenModal'

function App() {
  const [isOpen, setIsOpen] = useState(false)

  const [tokenFrom, setTokenFrom] = useState('cUSD')
  const [tokenTo, setTokenTo] = useState(null)
  const [choice, setChoice] = useState('to')

  const open = (choiceType) => {
    setChoice(choiceType)
    setIsOpen(true)
  }
  const close = () => setIsOpen(false)

  const selectToken = (token, choice) => {
    if (choice === 'from') {
      setTokenFrom(token)
      setIsOpen(false)
    } else {
      setTokenTo(token)
      setIsOpen(false)
    }
  }

  return (
    <>
      <div className="flex flex-1 flex-col h-screen w-full ">
        <NavbarComponent />

        {tokenFrom === tokenTo && (
          <div className="flex text-red-400 font-medium flex-row self-center bg-red-50 px-4 py-2 text-sm rounded-md mb-3 border-2 border-red-400">
            <h4>Swap tokens can not be the same</h4>
          </div>
        )}

        <div className="flex flex-1 w-full h-full items-center justify-center">
          <div className="p-2 w-1/3 px-4 py-4 shadow-md rounded-xl border-[0.5px]">
            <h1 className="font-medium">SWAP</h1>

            <div className="w-full border-[0.5px] p-2 rounded-md my-8">
              <div className="flex px-2 py-3 flex-row items-center justify-between">
                <h1 className="text-2xl font-medium">{tokenFrom}</h1>

                <button
                  onClick={() => open('from')}
                  className="text-white text-xs bg-blue-500  rounded-full px-2 py-1"
                >
                  Change
                </button>
              </div>

              <input
                type="number"
                placeholder="0.0"
                className="bg-neutral-100 text-xl outline-none my-3 w-full rounded-md p-2"
              />
            </div>

            <div className="w-full border-[0.5px] p-2 rounded-md my-4">
              <div className="flex px-2 py-3 flex-row items-center justify-between">
                {!tokenTo ? (
                  <button
                    onClick={() => open('to')}
                    className="text-lg bg-blue-500 text-white rounded-full px-4 py-2 font-medium"
                  >
                    Select a token
                  </button>
                ) : (
                  <>
                    <h1 className="text-2xl font-medium">{tokenTo}</h1>

                    <button
                      onClick={() => open('to')}
                      className="text-white text-xs bg-blue-500 rounded-full px-2 py-1"
                    >
                      Change
                    </button>
                  </>
                )}
              </div>

              <input
                type="number"
                placeholder="0.0"
                className="bg-neutral-100 text-xl outline-none my-3 w-full rounded-md p-2"
              />
            </div>

            {tokenFrom != tokenTo && (
              <>
                <h4 className="text-neutral-700 text-sm">
                  Estimated gas fee:{' '}
                </h4>
                <button className="w-full p-3 my-3 bg-blue-600 rounded-md text-white">
                  Swap
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <SelectTokenModal
        isOpen={isOpen}
        close={close}
        choice={choice}
        selectToken={selectToken}
      />
    </>
  )
}

export default App