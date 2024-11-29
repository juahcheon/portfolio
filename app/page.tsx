import Image from "next/image";
import { BlogPosts } from "../components/posts";

export default function Page() {
  return (
    <section>
      <div className='flex items-center mb-8'>
        <Image
          src='/profile.jpg'
          alt='profile image'
          width={100}
          height={100}
          className='rounded-full mr-4'
        />
        <h1 className='text-2xl font-semibold tracking-tighter'>
          안녕하세요, <br /> 저는 천주아입니다.
        </h1>
      </div>
      <p className='mb-4 font-semibold tracking-tighter text-xl'> 저는 배움을 멈추지 않고 늘 달리는 프론트엔드 엔지니어 입니다. </p>
      <p className='mb-4 '>웹 트렌드에 맞춰 나아가는 것이 프론트엔드의 숙명이라 생각합니다. 배움을 두려워하지 않고 도전하는 것을 좋아합니다. 평소 인터넷 페이지를 방문하며 느꼈던 불편함을 토대로 사용자의 편의성을 향상시키는 것을 목표로 합니다. 또한 코드의 간결성을 많이 신경 쓰는 편입니다. 스스로를 발전시킬 수 있는 업무 환경을 선호합니다</p>
      <div className='my-8'>
        <BlogPosts />
      </div>
    </section>
  );
}
