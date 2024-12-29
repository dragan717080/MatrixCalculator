import { FC } from "react";
import MatrixModalProps from "../interfaces/MatrixModalProps";

const MatrixModal: FC<MatrixModalProps> = ({ isOpen }) => {
  return (
    <>
      <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
        <div className="wrapper mt-[10%]">
        <div className="modal-content max-h-[37rem] overflow-y-scroll h-full bg-coffee rounded-[1.25rem]">
          <div>
            <h3 className="bold text-center text-white mt-6 mb-4 uppercase">
              История
            </h3>
            {/* Table Header */}
            <div className="my-8 mx-3.5 md:mx-7 py-1.5 Matrix-modal-table-row bg-lightcoffee text-sm md:text-md text-[#bd5887] bold rounded-xl">
              <div className="text-center">
                No.
              </div>
              <div className="text-center">
                Bombs
              </div>
              <div className="text-center">
                Multiplier
              </div>
              <div className="text-center">
                Payoff
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

export { MatrixModal };
