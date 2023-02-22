import React from 'react'

import tokens from '../../data/tokens.json'

export default function SelectTokenModal({
  close,
  isOpen,
  choice,
  selectToken,
}) {
  if (!isOpen) return

  return (
    <>
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative my-6 mx-auto w-2/5">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold">Select token {choice}</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={close}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-3 px-0 flex-auto overflow-y-scroll max-h-96">
                {tokens.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectToken(item, choice)}
                    className="w-full px-4 mb-2 py-2 cursor-pointer justify-between border-b-[0.5px] hover:bg-neutral-50 flex flex-col "
                  >
                    <h1 className="text-xl ">{item.name}</h1>
                    <h1 className="text-sm text-green-500">{item.symbol}</h1>
                  </div>
                ))}
              </div>

              {/*footer*/}
              <div className="flex items-center justify-end p-3 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    </>
  )
}
