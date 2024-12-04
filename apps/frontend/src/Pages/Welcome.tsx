import Banner from '../components/sections/Banner';
import FoodCategory from '../components/sections/FoodCategory';
import FoodService from '../components/sections/FoodService'; // Fixed import
import PopularFood from '../components/sections/PopularFood';
import PopularChefs from '../components/sections/PopularChefs';
import BecomeChef from '../components/sections/BecomeChef';
import UserReviews from '../components/sections/UserReviews';
import { FC } from 'react';


const Welcome: FC = () => {
    return (
        <>
            <Banner />
            <FoodCategory />
            <FoodService /> {/* Fixed component usage */}
            <PopularFood />
            <PopularChefs />
            <UserReviews />  {/* Add this line */}
            <BecomeChef />
        </>
    );
}
export default Welcome;