import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';

import {Heading} from '~/components/Text';
import {IconClose} from '~/components/Icon';

/**
 * Drawer component — Diamond Jewelry Co
 * Estilo WGK: overlay oscuro con blur, panel full-height, header sticky elegante
 */
export function Drawer({
  heading,
  open,
  onClose,
  openFrom = 'right',
  children,
}: {
  heading?: string;
  open: boolean;
  onClose: () => void;
  openFrom: 'right' | 'left';
  children: React.ReactNode;
}) {
  const offScreen = {
    right: 'translate-x-full',
    left: '-translate-x-full',
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>

        {/* ── OVERLAY ── */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Antes: bg-opacity-25 (muy claro). Ahora: 60% oscuro + blur */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`fixed inset-y-0 flex max-w-full ${
                openFrom === 'right' ? 'right-0' : 'left-0'
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
              >
                {/*
                  Antes: w-[80vw] max-w-sm  → panel pequeño
                  Ahora: w-full max-w-[390px] → cubre bien en móvil
                  Borde cambia lado según openFrom
                */}
                <Dialog.Panel
                  className={`w-full max-w-[390px] text-left transition-all transform shadow-2xl h-screen-dynamic bg-[#0A0F1E] flex flex-col ${
                    openFrom === 'right'
                      ? 'border-l border-white/10'
                      : 'border-r border-white/10'
                  }`}
                >

                  {/* ── HEADER DEL DRAWER ── */}
                  <header className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                    {heading && (
                      <Dialog.Title>
                        <Heading
                          as="span"
                          size="lead"
                          id="cart-contents"
                          className="text-white font-bold text-base uppercase tracking-widest"
                        >
                          {heading}
                        </Heading>
                      </Dialog.Title>
                    )}
                    <button
                      type="button"
                      onClick={onClose}
                      data-test="close-cart"
                      aria-label="Cerrar panel"
                      className="w-9 h-9 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 ml-auto"
                    >
                      <IconClose aria-label="Cerrar" />
                    </button>
                  </header>

                  {/* ── CONTENIDO (Cart, MenuMobileNav, etc.) ── */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {children}
                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>

      </Dialog>
    </Transition>
  );
}

/* Para asociar arialabelledby con el título */
Drawer.Title = Dialog.Title;

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openDrawer() {
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
}