import { Home, BookOpen, Newspaper, Globe, Youtube, Users, Brain, Tag } from "lucide-react"

export const navigationConfig = {
  mainNav: [
    {
      title: "Bài tập",
      href: "/exercises",
      icon: Brain,
    },

    {
      title: "Khóa học",
      icon: BookOpen,
      items: [
        // {
        //   title: "Tổng quan nội dung",
        //   href: "/courses",
        //   description: "Nơi tập hợp các khóa học lập trình hiện đại",
        //   icon: BookOpen
        // },
        {
          title: "Khóa học trực tuyến qua Zoom",
          href: "/courses/zoom",
          description: "Khóa lập trình hiện đại, viết tài liệu, lộ trình chi tiết được biên soạn không lí thuyết khô khan, học làm dự án thực tế",
          icon: Users
        },
        {
          title: "Khóa học trực tuyến trên Website",
          href: "/courses/website?page=1&size=10&search=",
          description: "Khóa học trực tuyến qua website, học làm dự án thực tế",
          icon: Globe
        },
        {
          title: "Khóa học trực tuyến miễn phí",
          href: "/courses/free",
          description: "Khóa học trực tuyến miễn phí, học làm dự án thực tế",
          icon: Youtube
        },
      ],
    },
    {
      title: "Blog",
      href: "/blog",
      icon: Newspaper,
    },
    {
      title: "Pricing",
      href: "/pricing",
      icon: Tag,
      className: "text-primary hover:text-primary/80",
    },
  ],
} 