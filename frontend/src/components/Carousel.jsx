import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

const Carousel = () => {
  return (
    <div>
         <section>
            <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
            <Swiper
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className="rounded-xl"
            >
                {[1, 2, 3].map((item) => (
                <SwiperSlide key={item}>
                    <div className="bg-gray-800 rounded-xl p-6 shadow-md h-48 flex flex-col justify-between">
                    <p className="text-lg font-semibold">Slide {item}</p>
                    <p className="text-sm text-gray-400">Some highlight info here.</p>
                    </div>
                </SwiperSlide>
                ))}
            </Swiper>
            </section>
    </div>
  )
}

export default Carousel