import { Avatar, ConnectButton } from 'web3uikit'

const NavbarComponent = () => {
  return (
    <nav className="w-full h-16 items-center justify-between px-8 flex flex-row p-2">
      <div className="flex flex-1">
        <h2 className="font-medium text-lg">CELO-SWAP</h2>
      </div>
      <ConnectButton moralisAuth={false} />
    </nav>
  )
}
export default NavbarComponent
