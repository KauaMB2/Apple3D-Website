import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei"
import * as THREE from "three"
import Lights from "./Lights"
import { Suspense } from "react"
import IPhone from "./IPhone"
import Loader from "./Loader"

interface Model{
    title: string,
    color: string[],
    img: string
}

interface ModelViewProps{
    index:number,
    groupRef:React.MutableRefObject<THREE.Group<THREE.Object3DEventMap>>,
    gsapType:string,
    controlRef:any,
    setRotationSize:React.Dispatch<React.SetStateAction<number>>,
    size:string,
    item:Model
}

const ModelView: React.FC<ModelViewProps> = ({ index, groupRef, gsapType, controlRef, setRotationSize, size, item }) => {
  return (
    <View index={index} id={gsapType} className={`w-full h-full ${index === 2} ? 'right-[-100%] : ''`}>
        <ambientLight intensity={0.3} />
        <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        <Lights />
        <OrbitControls
            makeDefault
            ref={controlRef}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.4}
            target={new THREE.Vector3(0, 0, 0)}
            onEnd={()=>{
                setRotationSize(controlRef.current.getAzimuthalAngle())
            }}
        />
        <group ref={groupRef} name={`${index===1} ? 'small' : 'large'`} position={[0, 0, 0]}>
            <Suspense fallback={<Loader />}>
                <IPhone item={item} scale={index === 1 ?[15, 15, 15] : [17, 17, 17]} />
            </Suspense>
        </group>
        
    </View>
  )
}

export default ModelView
