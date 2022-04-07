import female_avatar from '../assets/avatar_sets/female_avatar.png'
import male_avatar from '../assets/avatar_sets/male_avatar.png'
import avatar from '../assets/avatar_sets/avatar.png'
export default function imagesex(sex) {
    if(sex === "male"){
        return male_avatar
    }else if(sex === "female"){
        return female_avatar
    }else{
        return avatar
    }
}