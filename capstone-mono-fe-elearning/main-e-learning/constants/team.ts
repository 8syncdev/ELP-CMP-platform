import { adminPic, dev1QuangAnh, dev2HieuAnh, dev3MinhChien, dev4ThanhDuc, dev5Thang, name1, name2, name3, name4 } from '@/constants'



export const MY_TEAM = {
    members: [
        {
            name: 'Nguyễn Phương Anh Tú',
            major: 'Fullstack Developer',
            desc: 'Anh chào mừng các bạn đến với khóa học của 8Sync Dev. Anh là người sáng lập ra khóa học này, mong muốn giúp các bạn có thêm kiến thức và kỹ năng trong lĩnh vực lập trình.',
            role: 'Founder',
            phone: '0767449819',
            tech_stack: 'ReactJS, NextJS, MongoDB, Fast, Flutter, Django, Flask, Pytorch AI/ML, DRF, React Native, Security/Microservice Architecture, Docker',
            avatar_img: adminPic,
            neon_name_img: name1
        },
        {
            name: 'Đinh Thành Đức',
            major: 'Frontend Developer',
            desc: 'Chào các bạn, mình là Đức, mình là người đồng sáng lập ra khóa học này, mong muốn giúp các bạn vững vàng hơn trong lĩnh vực lập trình.',
            role: 'Co-Founder',
            phone: '',
            tech_stack: 'ReactJS, NextJS, Flutter, VueJS, NuxtJS, SvelteJS, AngularJS, Security/Microservice Architecture, Docker',
            avatar_img: dev4ThanhDuc,
            neon_name_img: name4
        },
        // {
        //     name: 'Lê Quốc Thắng',
        //     major: 'Frontend Developer',
        //     desc: 'Chào các bạn, mình là Thắng, mình là người đồng sáng lập ra khóa học này, mong muốn giúp các bạn vững vàng hơn trong lĩnh vực lập trình.',
        //     role: 'Co-Founder',
        //     phone: '',
        //     tech_stack: 'ReactJS, NextJS, Flutter, VueJS, NuxtJS, SvelteJS, AngularJS, Security/Microservice Architecture, Docker',
        //     avatar_img: dev5Thang,
        //     neon_name_img: name6
        // },
        // {
        //     name: 'Đinh Hữu Quang Anh',
        //     major: 'Backend Developer',
        //     desc: 'Chào các bạn, mình là Quang Anh, mình là người đồng sáng lập ra khóa học này, mong muốn giúp các bạn nâng việc lập trình lên một tầm cao mới.',
        //     role: 'Co-Founder',
        //     phone: '',
        //     tech_stack: 'NodeJS, ExpressJS, MongoDB, Firebase, Django, Flask, React Native, Security/Microservice Architecture, Docker',
        //     avatar_img: dev1QuangAnh,
        //     neon_name_img: name2
        // },
        // {
        //     name: 'Đặng Hiếu Anh',
        //     major: 'Frontend Developer',
        //     desc: 'Chào các bạn, mình là Hiếu Anh, mình là người đồng sáng lập ra khóa học này, mong muốn giúp các bạn có thêm kiến thức để phát triển bản thân trong lĩnh vực lập trình',
        //     role: 'Co-Founder',
        //     phone: '',
        //     tech_stack: 'ReactJS, NextJS, Flutter, VueJS, NuxtJS, SvelteJS, AngularJS, Security/Microservice Architecture, Docker',
        //     avatar_img: dev2HieuAnh,
        //     neon_name_img: name3
        // },
        // {
        //     name: 'Nguyễn Đình Minh Chiến',
        //     major: 'Frontend Developer',
        //     desc: 'Chào các bạn, mình là Minh Chiến, mình là người đồng sáng lập ra khóa học này, mong muốn giúp các bạn có thêm kiến thức để phát triển bản thân trong lĩnh vực lập trình',
        //     role: 'Co-Founder',
        //     phone: '',
        //     tech_stack: 'ReactJS, NextJS, Flutter, VueJS, NuxtJS, SvelteJS, AngularJS, Security/Microservice Architecture, Docker',
        //     avatar_img: dev3MinhChien,
        //     neon_name_img: name5
        // }, 
    ]
}

export type TeamMemberTYPE = typeof MY_TEAM.members[0]