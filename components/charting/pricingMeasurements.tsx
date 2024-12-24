import { useEffect, useState } from "react"
import { useFinancialsContext } from "../../context/FinancialsContext"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"
import { numberFormatting } from "../../lib/front-end/numberTextFormatting"

export const PercentageArrow = ({selectedPrice,initialRangePrice}) => {

  //console.log('props',selectedPrice)
    const [loading,setLoading] = useState<boolean>(true)

    useEffect(()=>{

      if(selectedPrice){
        setLoading(false)
      }else{
        setLoading(true)
      }


    },[selectedPrice,initialRangePrice])

    if(!loading){
      if(initialRangePrice!>=selectedPrice!){
        return (
          <div className="flex">          
            <ChevronDownIcon className="size-6 text-red font-bold"/>
            <h2 className="text-left text-red font-bold">
                ${numberFormatting(selectedPrice!-initialRangePrice!)} ({numberFormatting((selectedPrice!-initialRangePrice!)/initialRangePrice!*100)}%)
              </h2>
          </div>
        )
           
        }else{
          return (
            <div className="flex">          
              <ChevronUpIcon className="size-6 text-green font-bold"/>
              <h2 className="text-left text-green font-bold">
                ${numberFormatting(selectedPrice!-initialRangePrice!)} ({numberFormatting((selectedPrice!-initialRangePrice!)/initialRangePrice!*100)}%)
              </h2>
            </div>
          )
        }
    }else{
      <div>Waiting on user selection on graph</div>
    }


}