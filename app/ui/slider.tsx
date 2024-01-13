
import Image from 'next/image';
import Slider from "@ant-design/react-slick";
import "slick-carousel/slick/slick.css";
import { ImageInfo } from "@/app/lib/types/post"
import "slick-carousel/slick/slick-theme.css";
export function SimpleSlider({ images }: { images: ImageInfo[] }) {
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    const s3Url = "https://tiktakamedia.s3.ap-northeast-2.amazonaws.com/"
    return (
        <div className='mb-5'>
          <Slider {...settings} className='w-11/12'>
          {images.map((option, index) => (
            <div key={index} className='w-full sm:w-1/3 md:w-1/3 lg:w-1/4 p-2'>
              <div className='relative' style={{ paddingTop: '100%', overflow: 'hidden' }}>
                <Image 
                  key={option.id}
                  src={`${s3Url}${option.url}`}
                  alt=''
                  layout="fill"
                  objectFit="contain"
                  onError={(e) => {
                  }}
                />
              </div>
            </div>
          ))}
        </Slider>
        </div>
    );
  }