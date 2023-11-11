import { useRouter } from 'next/router'

export default function useLogout() {
  const router = useRouter()
  return async function handleLogout() {
    try {
      router.push("/")
      const res = await fetch('/api/auth/logout', {method: 'POST'})
      if (res.status === 200)
        console.log("User Logged Out")
        router.replace(router.asPath)
    } catch(err) {
      console.log(err)
    }
  }
}