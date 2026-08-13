import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import "./landing.scss";


const testimonials = [
    {
      name: 'Levy  Cohen',
      title: 'PipMasterPro',
      message: '"Successful trading is not about always being right; it\'s about managing risks, learning from every experience, and continuously adapting."',
      avatar: 'users/user1.png'
    },
    {
      name: 'Aviva Katz ',
      title: 'ChartWhisperer',
      message: '"Surround yourself with traders who challenge your strategies, share insights, and inspire you to grow.""',
      avatar: 'users/user2.png'
    },
    {
      name: 'Michal Williams',
      title: 'BullBearStrategist',
      message: '"Trading isn\’t just about numbers; it\’s about mindset. Stay disciplined, keep learning, and remember that every trade—win or lose—is a step forward on the journey to mastery."',
      avatar: 'users/user3.png'
    }
  ];



const Review = () => {
  return (
    
    <section className="testimonials" >
        <div className="container">
            <div className="section-header">
                <h1> Join the Beyvra community.</h1>
                <h2>In your country and connect with like-minded traders! </h2>
            
            </div>



            <div className="testimonial-swiper">
                <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                >
                {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                    <div className="testimonial-card">
                    <img src={testimonial.avatar} alt={`${testimonial.name} Avatar`} className="avatar" />
                    <h3>{testimonial.name}</h3>
                    <h4>{testimonial.title}</h4>
                    <p>{testimonial.message}</p>
                    </div>
                </SwiperSlide>
                ))}
                </Swiper>
            </div>



        </div>
    </section>
    
  );
};


export default Review;
