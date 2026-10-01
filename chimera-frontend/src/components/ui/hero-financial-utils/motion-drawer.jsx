import React from 'react'
import { X } from 'lucide-react'

export const MotionDrawer = ({
  children,
  direction = 'left',
  width = 300,
  backgroundColor = '#ffffff',
  clsBtnClassName = '',
  contentClassName = '',
  btnClassName = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={btnClassName}
      >
        Menu
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{ width: `${width}px`, backgroundColor }}
            className={`relative z-10 p-6 shadow-xl ${contentClassName}`}
          >
            <button
              onClick={() => setIsOpen(false)}
              className={`absolute top-4 right-4 p-1 rounded-md ${clsBtnClassName}`}
            >
              <X size={20} />
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default MotionDrawer
