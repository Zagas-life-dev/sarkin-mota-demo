import { createClientComponentClient } from './supabase-client'
import { v4 as uuidv4 } from 'uuid'

export interface AnalyticsEvent {
  page_name: string
  event_type: string
  event_data?: any
  user_id?: string
  session_id?: string
}

export const trackEvent = async (event: AnalyticsEvent) => {
  try {
    const supabase = createClientComponentClient()
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get or create session ID
    let sessionId = localStorage.getItem('sarkinmota_session_id')
    if (!sessionId) {
      sessionId = uuidv4()
      localStorage.setItem('sarkinmota_session_id', sessionId)
    }

    const analyticsData = {
      page_name: event.page_name,
      event_type: event.event_type,
      event_data: event.event_data,
      user_id: user?.id,
      session_id: sessionId,
    }

    const { error } = await supabase
      .from('analytics')
      .insert(analyticsData)

    if (error) {
      console.error('Analytics tracking error:', error)
    }
  } catch (error) {
    console.error('Analytics tracking failed:', error)
  }
}

export const trackPageView = async (pageName: string) => {
  await trackEvent({
    page_name: pageName,
    event_type: 'page_view',
  })
}

export const trackCarClick = async (carId: string, carTitle: string) => {
  await trackEvent({
    page_name: 'car_listing',
    event_type: 'car_click',
    event_data: {
      car_id: carId,
      car_title: carTitle,
    },
  })
}

export const trackContactClick = async (carId: string, carTitle: string, contactType: 'whatsapp' | 'phone' | 'email' | 'message') => {
  await trackEvent({
    page_name: 'car_detail',
    event_type: 'contact_click',
    event_data: {
      car_id: carId,
      car_title: carTitle,
      contact_type: contactType,
    },
  })
}

export const trackSearch = async (searchQuery: string, filters?: any) => {
  await trackEvent({
    page_name: 'search',
    event_type: 'search_query',
    event_data: {
      query: searchQuery,
      filters,
    },
  })
}

export const trackCarRequestSubmit = async (brand: string, model: string, year: number) => {
  await trackEvent({
    page_name: 'car_request',
    event_type: 'request_submit',
    event_data: {
      brand,
      model,
      year,
    },
  })
}

export const trackAffiliateClick = async (affiliateCode: string, carId?: string) => {
  await trackEvent({
    page_name: 'affiliate',
    event_type: 'affiliate_click',
    event_data: {
      affiliate_code: affiliateCode,
      car_id: carId,
    },
  })
}

export const trackAffiliateApply = async () => {
  await trackEvent({
    page_name: 'affiliate',
    event_type: 'affiliate_apply',
  })
}

export const trackUserRegistration = async () => {
  await trackEvent({
    page_name: 'auth',
    event_type: 'user_registration',
  })
}

export const trackUserLogin = async () => {
  await trackEvent({
    page_name: 'auth',
    event_type: 'user_login',
  })
}

// Analytics dashboard functions
export const getAnalyticsData = async (dateRange?: { start: string; end: string }) => {
  try {
    const supabase = createClientComponentClient()
    
    let query = supabase
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false })

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end)
    }

    const { data, error } = await query

    if (error) {
      console.error('Analytics fetch error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Analytics fetch failed:', error)
    return null
  }
}

export const getPopularCars = async (limit = 10) => {
  try {
    const supabase = createClientComponentClient()
    
    const { data, error } = await supabase
      .from('analytics')
      .select('event_data')
      .eq('event_type', 'car_click')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Popular cars fetch error:', error)
      return []
    }

    // Count car clicks
    const carCounts: { [key: string]: number } = {}
    data?.forEach(item => {
      const carId = item.event_data?.car_id
      if (carId) {
        carCounts[carId] = (carCounts[carId] || 0) + 1
      }
    })

    // Get car details for popular cars
    const popularCarIds = Object.keys(carCounts)
      .sort((a, b) => carCounts[b] - carCounts[a])
      .slice(0, limit)

    if (popularCarIds.length === 0) return []

    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id, title, brand, model, year, clicks')
      .in('id', popularCarIds)

    if (carsError) {
      console.error('Cars fetch error:', carsError)
      return []
    }

    return cars || []
  } catch (error) {
    console.error('Popular cars fetch failed:', error)
    return []
  }
}

export const getPageViewStats = async (dateRange?: { start: string; end: string }) => {
  try {
    const supabase = createClientComponentClient()
    
    let query = supabase
      .from('analytics')
      .select('page_name, created_at')
      .eq('event_type', 'page_view')

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end)
    }

    const { data, error } = await query

    if (error) {
      console.error('Page view stats error:', error)
      return {}
    }

    // Count page views by page
    const pageStats: { [key: string]: number } = {}
    data?.forEach(item => {
      pageStats[item.page_name] = (pageStats[item.page_name] || 0) + 1
    })

    return pageStats
  } catch (error) {
    console.error('Page view stats failed:', error)
    return {}
  }
} 