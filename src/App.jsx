import { useState } from 'react'
import qs from 'qs'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import Web3 from 'web3'
import BigNumber from 'big-number'
import ERC20ABI from '../data/abi.json'

import NavbarComponent from './components/NavbarComponent'
import SelectTokenModal from './components/SelectTokenModal'

function App() {
  const [isOpen, setIsOpen] = useState(false)

  const { account } = useMoralis()

  const [tokenFrom, setTokenFrom] = useState({
    id: 'celo-dollar',
    symbol: 'cusd',
    name: 'Celo Dollar',
    platforms: {
      celo: '0x765de816845861e75a25fca122bb6898b8b1282a',
      'near-protocol': 'cusd.token.a11bd.near',
    },
  })
  const [tokenTo, setTokenTo] = useState({})
  const [choice, setChoice] = useState('to')

  // Prices +
  const [amountEntered, setAmountEntered] = useState(0.0)
  const [amountTo, setAmountTo] = useState(null)
  const [gasPrice, setGasPrice] = useState(0.0)

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

  const getPrice = async () => {
    if (!tokenFrom.symbol || !tokenTo.symbol || !amountEntered) return

    // Get amount by calculating it from the smallest base unit of a standard erc20 token which is 18
    let amount = Number(amountEntered) * 10 ** 18

    // set the params
    const params = {
      sellToken: tokenFrom.platforms.celo
        ? tokenFrom.platforms.celo
        : tokenFrom.symbol,
      buyToken: tokenTo.platforms.celo
        ? tokenTo.platforms.celo
        : tokenTo.symbol,
      sellAmount: amount,
    }

    // Fetch the swap price.
    const response = await fetch(
      `https://celo.api.0x.org/swap/v1/price?${qs.stringify(params)}`
    )

    // Await and parse the JSON response
    const priceResult = await response.json()
    console.log('Price: ', priceResult)

    const pricesConverted = priceResult.buyAmount / 10 ** 18
    setAmountTo(pricesConverted)
    console.log('Price to: ', pricesConverted)

    setGasPrice(priceResult.estimatedGas)
  }

  const getQuote = async () => {
    if (!tokenFrom.symbol || !tokenTo.symbol || !amountEntered) return

    // Get amount by calculating it from the smallest base unit of a standard erc20 token which is 18
    let amount = Number(amountEntered) * 10 ** 18

    // set the params
    const params = {
      sellToken: tokenFrom.platforms.celo
        ? tokenFrom.platforms.celo
        : tokenFrom.symbol,
      buyToken: tokenTo.platforms.celo
        ? tokenTo.platforms.celo
        : tokenTo.symbol,
      sellAmount: amount,
      takerAddress: account,
    }

    const response = await fetch(
      `https://celo.api.0x.org/swap/v1/quote?${qs.stringify(params)}`
    )

    // Await and parse the JSON response
    const priceResult = await response.json()

    const pricesConverted = priceResult.buyAmount / 10 ** 18
    setAmountTo(pricesConverted)

    setGasPrice(priceResult.estimatedGas)

    return priceResult
  }

  const swap = async () => {
    // Get and return the created quote
    const priceQuote = await getQuote()

    // Create a web3 object from the ABI
    const web3 = new Web3(Web3.givenProvider)

    // Get the token from addess
    const tokenFromAddress = tokenFrom.platforms.celo

    // Create the contract instance
    const Contract = new web3.eth.Contract(ERC20ABI, tokenFromAddress)
    console.log('Contract instance set-up: ', Contract)

    // Get the Max Approved amount of the token and convert it using BigNumber
    const maxApproval = new BigNumber(2).pow(256).minus(1)
    console.log('approval amount: ', maxApproval)

    // Grant the spender address approval to spend the user's tokens
    const tx = await Contract.methods
      .approve(priceQuote.allowanceTarget, maxApproval)
      .send({ from: account })
      .then((res) => {
        console.log('tx: ', res)
      })
  }

  return (
    <>
      <div className="flex flex-1 flex-col h-screen w-full ">
        <NavbarComponent />

        {tokenFrom.symbol === tokenTo.symbol && (
          <div className="flex text-red-400 font-medium flex-row self-center bg-red-50 px-4 py-2 text-sm rounded-md mb-3 border-2 border-red-400">
            <h4>Swap tokens can not be the same</h4>
          </div>
        )}

        <div className="flex flex-1 w-full h-full items-center justify-center">
          <div className="p-2 w-1/3 px-4 py-4 shadow-md rounded-xl border-[0.5px]">
            <h1 className="font-medium">SWAP</h1>

            <div className="w-full border-[0.5px] p-2 rounded-md my-8">
              <div className="flex px-2 py-3 flex-row items-center justify-between">
                <h1 className="text-2xl font-medium">{tokenFrom.symbol}</h1>

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
                value={amountEntered}
                onChange={(e) => setAmountEntered(e.target.value)}
                onBlur={getPrice}
                className="bg-neutral-100 text-xl outline-none my-3 w-full rounded-md p-2"
              />
            </div>

            <div className="w-full border-[0.5px] p-2 rounded-md my-4">
              <div className="flex px-2 py-3 flex-row items-center justify-between">
                {!tokenTo.symbol ? (
                  <button
                    onClick={() => open('to')}
                    className="text-lg bg-blue-500 text-white rounded-full px-4 py-2 font-medium"
                  >
                    Select a token
                  </button>
                ) : (
                  <>
                    <h1 className="text-2xl font-medium">{tokenTo.symbol}</h1>

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
                disabled
                value={amountTo ? amountTo : 0.0}
                className="bg-neutral-100 text-xl outline-none cursor-not-allowed my-3 w-full rounded-md p-2"
              />
            </div>

            {tokenFrom.symbol != tokenTo.symbol && (
              <>
                <h4 className="text-neutral-700 text-sm">
                  Estimated gas fee: {gasPrice}
                </h4>

                {amountEntered && tokenTo.symbol ? (
                  <button
                    onClick={swap}
                    className="w-full p-3 my-3 bg-blue-600 rounded-md text-white"
                  >
                    Swap
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full p-3 my-3 cursor-not-allowed bg-neutral-300 rounded-md text-white"
                  >
                    Swap
                  </button>
                )}
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
