'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CheckCircle2, ArrowRight, Loader2, Facebook, Clock, GraduationCap, DollarSign } from 'lucide-react'
import { sendEmail } from '@/lib/actions/email.actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CourseDto } from '@/lib/actions/course'
import { formatCurrency } from '@/lib/currency'

interface Props {
  course: CourseDto;
}

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Họ tên phải có ít nhất 2 ký tự",
  }),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  phone: z.string().regex(/^[0-9]{10}$/, {
    message: "Số điện thoại phải có 10 chữ số",
  }),
  fbLink: z.string().url({
    message: "Link Facebook không hợp lệ",
  }),
  studyTime: z.enum(["schedule1", "schedule2", "custom"]),
  customSchedule: z.string().optional(),
}).refine((data) => {
  if (data.studyTime === 'custom' && !data.customSchedule) {
    return false
  }
  return true
}, {
  message: "Vui lòng nhập thời gian học mong muốn",
  path: ["customSchedule"],
})

export const MainPaymentPage = ({ course }: Props) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      fbLink: "",
      studyTime: "schedule1",
      customSchedule: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    const scheduleText = values.studyTime === 'custom'
      ? values.customSchedule
      : values.studyTime === 'schedule1'
        ? '2,4,6'
        : '3,5,7'

    const content = `
      Khóa học: ${course.metadata.name}
      Giá: ${formatCurrency(course.metadata.discounted_price)}
      Giảng viên: ${course.metadata.instructor_name}
      
      THÔNG TIN HỌC VIÊN
      Họ và tên: ${values.fullName}
      Email: ${values.email}
      Số điện thoại: ${values.phone}
      Facebook: ${values.fbLink}
      Khung giờ học: ${scheduleText}
    `

    const success = await sendEmail(values.email, content)
    if (success) {
      setStep(2)
    }
    setLoading(false)
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="flex flex-col min-h-screen h-auto">
        <Card className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center">{course.metadata.name}</h1>
            <div className="mt-4 flex justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{course.metadata.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{course.metadata.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(course.metadata.discounted_price)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200'
              }`}>
              1
            </div>
            <div className="h-1 w-20 bg-gray-200 mx-2" />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200'
              }`}>
              2
            </div>
          </div>

          {step === 1 ? (
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <h2 className="text-2xl font-bold text-center mb-6">Đăng ký khóa học</h2>

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fbLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link Facebook</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Facebook className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="studyTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Khung giờ học</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="schedule1" id="schedule1" />
                              <Label htmlFor="schedule1">2, 4, 6</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="schedule2" id="schedule2" />
                              <Label htmlFor="schedule2">3, 5, 7</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="custom" id="custom" />
                              <Label htmlFor="custom">Khác</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("studyTime") === "custom" && (
                    <FormField
                      control={form.control}
                      name="customSchedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thời gian học mong muốn</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Vui lòng ghi rõ thời gian học mong muốn của bạn"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Gửi đăng ký
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold">Đăng ký thành công!</h2>
              <p className="text-gray-600">
                Cảm ơn bạn đã đăng ký khóa học "{course.metadata.name}".
                Chúng tôi sẽ liên hệ với bạn trong vòng 48 giờ qua số điện thoại
                hoặc Facebook để xác nhận thông tin.
              </p>
              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-600">
                  Mọi thắc mắc xin vui lòng liên hệ: {course.metadata.instructor_contact}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
