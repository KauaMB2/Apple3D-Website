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
    <View index={index} id={gsapType} className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}>{/*Create a 3D view div for the iphone model*/}
        <ambientLight intensity={0.3} />{/*Set the light of the iphone*/}
        <PerspectiveCamera makeDefault position={[0, 0, 4]} />{/*Define the beggining perspective*/}
        <Lights />{/*Set the environment light*/}
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
                <IPhone item={item} size={size} scale={index === 1 ?[15, 15, 15] : [17, 17, 17]} />
            </Suspense>
        </group>
        
    </View>
  )
}

export default ModelView
