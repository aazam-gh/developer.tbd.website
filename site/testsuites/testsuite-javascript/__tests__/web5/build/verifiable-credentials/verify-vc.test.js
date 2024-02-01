import { test, expect, describe } from 'vitest';
import {
  verifyCredentials,
  checkVerificationResults,
  evaluatePresentation,
} from '../../../../../../code-snippets/web5/build/verifiable-credentials/verify-vc';

const expectedVerificationResults = [
  {
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDppb246RWlBbVBHbmJzZVUtOW9mcWR4MGVaQjI1QTE1V3Bfam5LWDVoQmZDd2VPajUwUTpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0dGMybG5JaXdpY0hWaWJHbGpTMlY1U25kcklqcDdJbU55ZGlJNklrVmtNalUxTVRraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVdTMXBNMDVOYVZOYVdsWkdRVzF4V25reGNtMTZjMGRFVmpWSVJUbFpkVWx2WkZSSGRscFdiall4WnlKOUxDSndkWEp3YjNObGN5STZXeUpoZFhSb1pXNTBhV05oZEdsdmJpSXNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSmRMQ0owZVhCbElqb2lTbk52YmxkbFlrdGxlVEl3TWpBaWZWMHNJbk5sY25acFkyVnpJanBiWFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUTJveWRsUlFZMGRmZVZWdFNXVmtkMGRPWHpKeWNtTm9RVk5ZWW1SSWJYQTRMV0l4ZVV4cFdHSkVSR2NpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVTlRVREZ0WHpWUU1uaE1TVVZxU2toalRHNTVObkZZTkcxT2QyeFhaR2QxVTJrMFNYRk5TWE16V2taQklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsRFVuWjNSV3BTVVRKd04xcHhibmhhVTA1bloyOVJiVTVIZDFoVWFUTlhYMDV0VWpJMlZUQm5XVmhVZHlKOWZRI2R3bi1zaWcifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRW1wbG95bWVudENyZWRlbnRpYWwiXSwiaWQiOiJ1cm46dXVpZDpiOGI4OTM1NS01MTZjLTQ3YWYtYjdmMy1lNzBhOTFkZjhlMGEiLCJpc3N1ZXIiOiJkaWQ6aW9uOkVpQW1QR25ic2VVLTlvZnFkeDBlWkIyNUExNVdwX2puS1g1aEJmQ3dlT2o1MFE6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNHRjMmxuSWl3aWNIVmliR2xqUzJWNVNuZHJJanA3SW1OeWRpSTZJa1ZrTWpVMU1Ua2lMQ0pyZEhraU9pSlBTMUFpTENKNElqb2lXUzFwTTA1TmFWTmFXbFpHUVcxeFdua3hjbTE2YzBkRVZqVklSVGxaZFVsdlpGUkhkbHBXYmpZeFp5SjlMQ0p3ZFhKd2IzTmxjeUk2V3lKaGRYUm9aVzUwYVdOaGRHbHZiaUlzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0pkTENKMGVYQmxJam9pU25OdmJsZGxZa3RsZVRJd01qQWlmVjBzSW5ObGNuWnBZMlZ6SWpwYlhYMTlYU3dpZFhCa1lYUmxRMjl0YldsMGJXVnVkQ0k2SWtWcFEyb3lkbFJRWTBkZmVWVnRTV1ZrZDBkT1h6SnljbU5vUVZOWVltUkliWEE0TFdJeGVVeHBXR0pFUkdjaWZTd2ljM1ZtWm1sNFJHRjBZU0k2ZXlKa1pXeDBZVWhoYzJnaU9pSkZhVU5UVURGdFh6VlFNbmhNU1VWcVNraGpURzU1Tm5GWU5HMU9kMnhYWkdkMVUyazBTWEZOU1hNeldrWkJJaXdpY21WamIzWmxjbmxEYjIxdGFYUnRaVzUwSWpvaVJXbERVblozUldwU1VUSndOMXB4Ym5oYVUwNW5aMjlSYlU1SGQxaFVhVE5YWDA1dFVqSTJWVEJuV1ZoVWR5SjlmUSIsImlzc3VhbmNlRGF0ZSI6IjIwMjMtMTItMjdUMTg6MTI6MzlaIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6aW9uOkVpQllCbnQwbTB5NzNWMDdVOS1yZEt0VS1GZ2ViUlVoVVQ0VUxBc0pCZ3p2U2c6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNHRjMmxuSWl3aWNIVmliR2xqUzJWNVNuZHJJanA3SW1OeWRpSTZJa1ZrTWpVMU1Ua2lMQ0pyZEhraU9pSlBTMUFpTENKNElqb2lVVVJHUVhSSldUTnlVWEZCWkZSYWVrOUxPVTVhWm5jeVlsWlhNMnBKVUdkdFZXTjZiWFpwVVdFeGR5SjlMQ0p3ZFhKd2IzTmxjeUk2V3lKaGRYUm9aVzUwYVdOaGRHbHZiaUlzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0pkTENKMGVYQmxJam9pU25OdmJsZGxZa3RsZVRJd01qQWlmVjBzSW5ObGNuWnBZMlZ6SWpwYlhYMTlYU3dpZFhCa1lYUmxRMjl0YldsMGJXVnVkQ0k2SWtWcFFYTkNRbmt0V0hweVoyNUtiR2RWV25JeWRtaFpkbFJoZVc5eGJETXdTa3h4YlUxQ1kyWkNkbEZrY21jaWZTd2ljM1ZtWm1sNFJHRjBZU0k2ZXlKa1pXeDBZVWhoYzJnaU9pSkZhVU5qVEhwbVpWQkRMV3RCV1hNeVoyNWtYMDVEZVVjM1UwWlBWM2RpZEdWdFdYVjNUa2xYY0RjelNVaEJJaXdpY21WamIzWmxjbmxEYjIxdGFYUnRaVzUwSWpvaVJXbEJUMTh3Tm1OcGFTMVlRVmcyU1dadmNuUnFRVzAxU1ZaRWMyZENSMko0TjBaRlIzcGlXR0ZwUXpKNlVTSjlmUSIsImVtcGxveW1lbnRTdGF0dXMiOiJlbXBsb3llZCJ9fSwiaXNzIjoiZGlkOmlvbjpFaUFtUEduYnNlVS05b2ZxZHgwZVpCMjVBMTVXcF9qbktYNWhCZkN3ZU9qNTBROmV5SmtaV3gwWVNJNmV5SndZWFJqYUdWeklqcGJleUpoWTNScGIyNGlPaUp5WlhCc1lXTmxJaXdpWkc5amRXMWxiblFpT25zaWNIVmliR2xqUzJWNWN5STZXM3NpYVdRaU9pSmtkMjR0YzJsbklpd2ljSFZpYkdsalMyVjVTbmRySWpwN0ltTnlkaUk2SWtWa01qVTFNVGtpTENKcmRIa2lPaUpQUzFBaUxDSjRJam9pV1MxcE0wNU5hVk5hV2xaR1FXMXhXbmt4Y20xNmMwZEVWalZJUlRsWmRVbHZaRlJIZGxwV2JqWXhaeUo5TENKd2RYSndiM05sY3lJNld5SmhkWFJvWlc1MGFXTmhkR2x2YmlJc0ltRnpjMlZ5ZEdsdmJrMWxkR2h2WkNKZExDSjBlWEJsSWpvaVNuTnZibGRsWWt0bGVUSXdNakFpZlYwc0luTmxjblpwWTJWeklqcGJYWDE5WFN3aWRYQmtZWFJsUTI5dGJXbDBiV1Z1ZENJNklrVnBRMm95ZGxSUVkwZGZlVlZ0U1dWa2QwZE9Yekp5Y21Ob1FWTllZbVJJYlhBNExXSXhlVXhwV0dKRVJHY2lmU3dpYzNWbVptbDRSR0YwWVNJNmV5SmtaV3gwWVVoaGMyZ2lPaUpGYVVOVFVERnRYelZRTW5oTVNVVnFTa2hqVEc1NU5uRllORzFPZDJ4WFpHZDFVMmswU1hGTlNYTXpXa1pCSWl3aWNtVmpiM1psY25sRGIyMXRhWFJ0Wlc1MElqb2lSV2xEVW5aM1JXcFNVVEp3TjFweGJuaGFVMDVuWjI5UmJVNUhkMWhVYVROWFgwNXRVakkyVlRCbldWaFVkeUo5ZlEiLCJzdWIiOiJkaWQ6aW9uOkVpQllCbnQwbTB5NzNWMDdVOS1yZEt0VS1GZ2ViUlVoVVQ0VUxBc0pCZ3p2U2c6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNHRjMmxuSWl3aWNIVmliR2xqUzJWNVNuZHJJanA3SW1OeWRpSTZJa1ZrTWpVMU1Ua2lMQ0pyZEhraU9pSlBTMUFpTENKNElqb2lVVVJHUVhSSldUTnlVWEZCWkZSYWVrOUxPVTVhWm5jeVlsWlhNMnBKVUdkdFZXTjZiWFpwVVdFeGR5SjlMQ0p3ZFhKd2IzTmxjeUk2V3lKaGRYUm9aVzUwYVdOaGRHbHZiaUlzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0pkTENKMGVYQmxJam9pU25OdmJsZGxZa3RsZVRJd01qQWlmVjBzSW5ObGNuWnBZMlZ6SWpwYlhYMTlYU3dpZFhCa1lYUmxRMjl0YldsMGJXVnVkQ0k2SWtWcFFYTkNRbmt0V0hweVoyNUtiR2RWV25JeWRtaFpkbFJoZVc5eGJETXdTa3h4YlUxQ1kyWkNkbEZrY21jaWZTd2ljM1ZtWm1sNFJHRjBZU0k2ZXlKa1pXeDBZVWhoYzJnaU9pSkZhVU5qVEhwbVpWQkRMV3RCV1hNeVoyNWtYMDVEZVVjM1UwWlBWM2RpZEdWdFdYVjNUa2xYY0RjelNVaEJJaXdpY21WamIzWmxjbmxEYjIxdGFYUnRaVzUwSWpvaVJXbEJUMTh3Tm1OcGFTMVlRVmcyU1dadmNuUnFRVzAxU1ZaRWMyZENSMko0TjBaRlIzcGlXR0ZwUXpKNlVTSjlmUSJ9.ex6f3obHx_Mh1aab3oU5JRBoqncUEAc7o426aKpbQXDWbi_pJ98cyH0BtPKC_twXaEdNJUjuxpVNjIUyJxFuBA',
    result: {
      issuer:
        'did:ion:EiAmPGnbseU-9ofqdx0eZB25A15Wp_jnKX5hBfCweOj50Q:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiWS1pM05NaVNaWlZGQW1xWnkxcm16c0dEVjVIRTlZdUlvZFRHdlpWbjYxZyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiIsImFzc2VydGlvbk1ldGhvZCJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQ2oydlRQY0dfeVVtSWVkd0dOXzJycmNoQVNYYmRIbXA4LWIxeUxpWGJERGcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUNTUDFtXzVQMnhMSUVqSkhjTG55NnFYNG1Od2xXZGd1U2k0SXFNSXMzWkZBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlDUnZ3RWpSUTJwN1pxbnhaU05nZ29RbU5Hd1hUaTNXX05tUjI2VTBnWVhUdyJ9fQ',
      subject:
        'did:ion:EiBYBnt0m0y73V07U9-rdKtU-FgebRUhUT4ULAsJBgzvSg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiUURGQXRJWTNyUXFBZFRaek9LOU5aZncyYlZXM2pJUGdtVWN6bXZpUWExdyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiIsImFzc2VydGlvbk1ldGhvZCJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQXNCQnktWHpyZ25KbGdVWnIydmhZdlRheW9xbDMwSkxxbU1CY2ZCdlFkcmcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUNjTHpmZVBDLWtBWXMyZ25kX05DeUc3U0ZPV3didGVtWXV3TklXcDczSUhBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlBT18wNmNpaS1YQVg2SWZvcnRqQW01SVZEc2dCR2J4N0ZFR3piWGFpQzJ6USJ9fQ',
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        'type': ['VerifiableCredential', 'EmploymentCredential'],
        'id': 'urn:uuid:b8b89355-516c-47af-b7f3-e70a91df8e0a',
        'issuer':
          'did:ion:EiAmPGnbseU-9ofqdx0eZB25A15Wp_jnKX5hBfCweOj50Q:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiWS1pM05NaVNaWlZGQW1xWnkxcm16c0dEVjVIRTlZdUlvZFRHdlpWbjYxZyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiIsImFzc2VydGlvbk1ldGhvZCJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQ2oydlRQY0dfeVVtSWVkd0dOXzJycmNoQVNYYmRIbXA4LWIxeUxpWGJERGcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUNTUDFtXzVQMnhMSUVqSkhjTG55NnFYNG1Od2xXZGd1U2k0SXFNSXMzWkZBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlDUnZ3RWpSUTJwN1pxbnhaU05nZ29RbU5Hd1hUaTNXX05tUjI2VTBnWVhUdyJ9fQ',
        'issuanceDate': '2023-12-27T18:12:39Z',
        'credentialSubject': {
          id: 'did:ion:EiBYBnt0m0y73V07U9-rdKtU-FgebRUhUT4ULAsJBgzvSg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiUURGQXRJWTNyUXFBZFRaek9LOU5aZncyYlZXM2pJUGdtVWN6bXZpUWExdyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiIsImFzc2VydGlvbk1ldGhvZCJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQXNCQnktWHpyZ25KbGdVWnIydmhZdlRheW9xbDMwSkxxbU1CY2ZCdlFkcmcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUNjTHpmZVBDLWtBWXMyZ25kX05DeUc3U0ZPV3didGVtWXV3TklXcDczSUhBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlBT18wNmNpaS1YQVg2SWZvcnRqQW01SVZEc2dCR2J4N0ZFR3piWGFpQzJ6USJ9fQ',
          employmentStatus: 'employed',
        },
      },
    },
    isValid: true,
    error: null,
  },
  {
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDppb246RWlBbVBHbmJzZVUtOW9mcWR4MGVaQjI1QTE1V3Bfam5LWDVoQmZDd2VPajUwUTpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0dGMybG5JaXdpY0hWaWJHbGpTMlY1U25kcklqcDdJbU55ZGlJNklrVmtNalUxTVRraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVdTMXBNMDVOYVZOYVdsWkdRVzF4V25reGNtMTZjMGRFVmpWSVJUbFpkVWx2WkZSSGRscFdiall4WnlKOUxDSndkWEp3YjNObGN5STZXeUpoZFhSb1pXNTBhV05oZEdsdmJpSXNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSmRMQ0owZVhCbElqb2lTbk52YmxkbFlrdGxlVEl3TWpBaWZWMHNJbk5sY25acFkyVnpJanBiWFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUTJveWRsUlFZMGRmZVZWdFNXVmtkMGRPWHpKeWNtTm9RVk5ZWW1SSWJYQTRMV0l4ZVV4cFdHSkVSR2NpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVTlRVREZ0WHpWUU1uaE1TVVZxU2toalRHNTVObkZZTkcxT2QyeFhaR2QxVTJrMFNYRk5TWE16V2taQklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsRFVuWjNSV3BTVVRKd04xcHhibmhhVTA1bloyOVJiVTVIZDFoVWFUTlhYMDV0VWpJMlZUQm5XVmhVZHlKOWZRI2R3bi1zaWcifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiUElJQ3JlZGVudGlhbCJdLCJpZCI6InVybjp1dWlkOjMyMTY5NTE5LWU2NTgtNGQxYi1hYzUxLTIxYjhhODI4YzYxZiIsImlzc3VlciI6ImRpZDppb246RWlBbVBHbmJzZVUtOW9mcWR4MGVaQjI1QTE1V3Bfam5LWDVoQmZDd2VPajUwUTpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0dGMybG5JaXdpY0hWaWJHbGpTMlY1U25kcklqcDdJbU55ZGlJNklrVmtNalUxTVRraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVdTMXBNMDVOYVZOYVdsWkdRVzF4V25reGNtMTZjMGRFVmpWSVJUbFpkVWx2WkZSSGRscFdiall4WnlKOUxDSndkWEp3YjNObGN5STZXeUpoZFhSb1pXNTBhV05oZEdsdmJpSXNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSmRMQ0owZVhCbElqb2lTbk52YmxkbFlrdGxlVEl3TWpBaWZWMHNJbk5sY25acFkyVnpJanBiWFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUTJveWRsUlFZMGRmZVZWdFNXVmtkMGRPWHpKeWNtTm9RVk5ZWW1SSWJYQTRMV0l4ZVV4cFdHSkVSR2NpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVTlRVREZ0WHpWUU1uaE1TVVZxU2toalRHNTVObkZZTkcxT2QyeFhaR2QxVTJrMFNYRk5TWE16V2taQklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsRFVuWjNSV3BTVVRKd04xcHhibmhhVTA1bloyOVJiVTVIZDFoVWFUTlhYMDV0VWpJMlZUQm5XVmhVZHlKOWZRIiwiaXNzdWFuY2VEYXRlIjoiMjAyMy0xMi0yN1QxODoxMjozOVoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDppb246RWlCWUJudDBtMHk3M1YwN1U5LXJkS3RVLUZnZWJSVWhVVDRVTEFzSkJnenZTZzpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0dGMybG5JaXdpY0hWaWJHbGpTMlY1U25kcklqcDdJbU55ZGlJNklrVmtNalUxTVRraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVVVUkdRWFJKV1ROeVVYRkJaRlJhZWs5TE9VNWFabmN5WWxaWE0ycEpVR2R0VldONmJYWnBVV0V4ZHlKOUxDSndkWEp3YjNObGN5STZXeUpoZFhSb1pXNTBhV05oZEdsdmJpSXNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSmRMQ0owZVhCbElqb2lTbk52YmxkbFlrdGxlVEl3TWpBaWZWMHNJbk5sY25acFkyVnpJanBiWFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUVhOQ1Fua3RXSHB5WjI1S2JHZFZXbkl5ZG1oWmRsUmhlVzl4YkRNd1NreHhiVTFDWTJaQ2RsRmtjbWNpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVTmpUSHBtWlZCRExXdEJXWE15WjI1a1gwNURlVWMzVTBaUFYzZGlkR1Z0V1hWM1RrbFhjRGN6U1VoQklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsQlQxOHdObU5wYVMxWVFWZzJTV1p2Y25ScVFXMDFTVlpFYzJkQ1IySjROMFpGUjNwaVdHRnBReko2VVNKOWZRIiwibmFtZSI6IkFsaWNlIFNtaXRoIiwiZGF0ZU9mQmlydGgiOiIyMDAxLTEyLTIxVDE3OjAyOjAxWiJ9fSwiaXNzIjoiZGlkOmlvbjpFaUFtUEduYnNlVS05b2ZxZHgwZVpCMjVBMTVXcF9qbktYNWhCZkN3ZU9qNTBROmV5SmtaV3gwWVNJNmV5SndZWFJqYUdWeklqcGJleUpoWTNScGIyNGlPaUp5WlhCc1lXTmxJaXdpWkc5amRXMWxiblFpT25zaWNIVmliR2xqUzJWNWN5STZXM3NpYVdRaU9pSmtkMjR0YzJsbklpd2ljSFZpYkdsalMyVjVTbmRySWpwN0ltTnlkaUk2SWtWa01qVTFNVGtpTENKcmRIa2lPaUpQUzFBaUxDSjRJam9pV1MxcE0wNU5hVk5hV2xaR1FXMXhXbmt4Y20xNmMwZEVWalZJUlRsWmRVbHZaRlJIZGxwV2JqWXhaeUo5TENKd2RYSndiM05sY3lJNld5SmhkWFJvWlc1MGFXTmhkR2x2YmlJc0ltRnpjMlZ5ZEdsdmJrMWxkR2h2WkNKZExDSjBlWEJsSWpvaVNuTnZibGRsWWt0bGVUSXdNakFpZlYwc0luTmxjblpwWTJWeklqcGJYWDE5WFN3aWRYQmtZWFJsUTI5dGJXbDBiV1Z1ZENJNklrVnBRMm95ZGxSUVkwZGZlVlZ0U1dWa2QwZE9Yekp5Y21Ob1FWTllZbVJJYlhBNExXSXhlVXhwV0dKRVJHY2lmU3dpYzNWbVptbDRSR0YwWVNJNmV5SmtaV3gwWVVoaGMyZ2lPaUpGYVVOVFVERnRYelZRTW5oTVNVVnFTa2hqVEc1NU5uRllORzFPZDJ4WFpHZDFVMmswU1hGTlNYTXpXa1pCSWl3aWNtVmpiM1psY25sRGIyMXRhWFJ0Wlc1MElqb2lSV2xEVW5aM1JXcFNVVEp3TjFweGJuaGFVMDVuWjI5UmJVNUhkMWhVYVROWFgwNXRVakkyVlRCbldWaFVkeUo5ZlEiLCJzdWIiOiJkaWQ6aW9uOkVpQllCbnQwbTB5NzNWMDdVOS1yZEt0VS1GZ2ViUlVoVVQ0VUxBc0pCZ3p2U2c6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNHRjMmxuSWl3aWNIVmliR2xqUzJWNVNuZHJJanA3SW1OeWRpSTZJa1ZrTWpVMU1Ua2lMQ0pyZEhraU9pSlBTMUFpTENKNElqb2lVVVJHUVhSSldUTnlVWEZCWkZSYWVrOUxPVTVhWm5jeVlsWlhNMnBKVUdkdFZXTjZiWFpwVVdFeGR5SjlMQ0p3ZFhKd2IzTmxjeUk2V3lKaGRYUm9aVzUwYVdOaGRHbHZiaUlzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0pkTENKMGVYQmxJam9pU25OdmJsZGxZa3RsZVRJd01qQWlmVjBzSW5ObGNuWnBZMlZ6SWpwYlhYMTlYU3dpZFhCa1lYUmxRMjl0YldsMGJXVnVkQ0k2SWtWcFFYTkNRbmt0V0hweVoyNUtiR2RWV25JeWRtaFpkbFJoZVc5eGJETXdTa3h4YlUxQ1kyWkNkbEZrY21jaWZTd2ljM1ZtWm1sNFJHRjBZU0k2ZXlKa1pXeDBZVWhoYzJnaU9pSkZhVU5qVEhwbVpWQkRMV3RCV1hNeVoyNWtYMDVEZVVjM1UwWlBWM2RpZEdWdFdYVjNUa2xYY0RjelNVaEJJaXdpY21WamIzWmxjbmxEYjIxdGFYUnRaVzUwSWpvaVJXbEJUMTh3Tm1OcGFTMVlRVmcyU1dadmNuUnFRVzAxU1ZaRWMyZENSMko0TjBaRlIzcGlXR0ZwUXpKNlVTSjlmUSJ9.l0_H9lUbTNSZ5p1loo3n2bk8lKxmYzRoNcK6IwO3X23DNhW0b3At_goX40IjqhrN7RwFosQz-h69bJb4z6HzCA',
    result: {
      issuer:
        'did:ion:EiAmPGnbseU-9ofqdx0eZB25A15Wp_jnKX5hBfCweOj50Q:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiWS1pM05NaVNaWlZGQW1xWnkxcm16c0dEVjVIRTlZdUlvZFRHdlpWbjYxZyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiIsImFzc2VydGlvbk1ldGhvZCJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQ2oydlRQY0dfeVVtSWVkd0dOXzJycmNoQVNYYmRIbXA4LWIxeUxpWGJERGcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUNTUDFtXzVQMnhMSUVqSkhjTG55NnFYNG1Od2xXZGd1U2k0SXFNSXMzWkZBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlDUnZ3RWpSUTJwN1pxbnhaU05nZ29RbU5Hd1hUaTNXX05tUjI2VTBnWVhUdyJ9fQ',
      subject:
        'did:ion:EiBYBnt0m0y73V07U9-rdKtU-FgebRUhUT4ULAsJBgzvSg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiUURGQXRJWTNyUXFBZFRaek9LOU5aZncyYlZXM2pJUGdtVWN6bXZpUWExdyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiIsImFzc2VydGlvbk1ldGhvZCJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQXNCQnktWHpyZ25KbGdVWnIydmhZdlRheW9xbDMwSkxxbU1CY2ZCdlFkcmcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUNjTHpmZVBDLWtBWXMyZ25kX05DeUc3U0ZPV3didGVtWXV3TklXcDczSUhBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlBT18wNmNpaS1YQVg2SWZvcnRqQW01SVZEc2dCR2J4N0ZFR3piWGFpQzJ6USJ9fQ',
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        'type': ['VerifiableCredential', 'PIICredential'],
        'id': 'urn:uuid:32169519-e658-4d1b-ac51-21b8a828c61f',
        'issuer':
          'did:ion:EiAmPGnbseU-9ofqdx0eZB25A15Wp_jnKX5hBfCweOj50Q:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiWS1pM05NaVNaWlZGQW1xWnkxcm16c0dEVjVIRTlZdUlvZFRHdlpWbjYxZyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiIsImFzc2VydGlvbk1ldGhvZCJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQ2oydlRQY0dfeVVtSWVkd0dOXzJycmNoQVNYYmRIbXA4LWIxeUxpWGJERGcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUNTUDFtXzVQMnhMSUVqSkhjTG55NnFYNG1Od2xXZGd1U2k0SXFNSXMzWkZBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlDUnZ3RWpSUTJwN1pxbnhaU05nZ29RbU5Hd1hUaTNXX05tUjI2VTBnWVhUdyJ9fQ',
        'issuanceDate': '2023-12-27T18:12:39Z',
        'credentialSubject': {
          id: 'did:ion:EiBYBnt0m0y73V07U9-rdKtU-FgebRUhUT4ULAsJBgzvSg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiUURGQXRJWTNyUXFBZFRaek9LOU5aZncyYlZXM2pJUGdtVWN6bXZpUWExdyJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiIsImFzc2VydGlvbk1ldGhvZCJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQXNCQnktWHpyZ25KbGdVWnIydmhZdlRheW9xbDMwSkxxbU1CY2ZCdlFkcmcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUNjTHpmZVBDLWtBWXMyZ25kX05DeUc3U0ZPV3didGVtWXV3TklXcDczSUhBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlBT18wNmNpaS1YQVg2SWZvcnRqQW01SVZEc2dCR2J4N0ZFR3piWGFpQzJ6USJ9fQ',
          name: 'Alice Smith',
          dateOfBirth: '2001-12-21T17:02:01Z',
        },
      },
    },
    isValid: true,
    error: null,
  },
];

const expectedEvaluationResults = {
  areRequiredCredentialsPresent: 'info',
  verifiableCredential: [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDppb246RWlBbVBHbmJzZVUtOW9mcWR4MGVaQjI1QTE1V3Bfam5LWDVoQmZDd2VPajUwUTpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0dGMybG5JaXdpY0hWaWJHbGpTMlY1U25kcklqcDdJbU55ZGlJNklrVmtNalUxTVRraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVdTMXBNMDVOYVZOYVdsWkdRVzF4V25reGNtMTZjMGRFVmpWSVJUbFpkVWx2WkZSSGRscFdiall4WnlKOUxDSndkWEp3YjNObGN5STZXeUpoZFhSb1pXNTBhV05oZEdsdmJpSXNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSmRMQ0owZVhCbElqb2lTbk52YmxkbFlrdGxlVEl3TWpBaWZWMHNJbk5sY25acFkyVnpJanBiWFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUTJveWRsUlFZMGRmZVZWdFNXVmtkMGRPWHpKeWNtTm9RVk5ZWW1SSWJYQTRMV0l4ZVV4cFdHSkVSR2NpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVTlRVREZ0WHpWUU1uaE1TVVZxU2toalRHNTVObkZZTkcxT2QyeFhaR2QxVTJrMFNYRk5TWE16V2taQklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsRFVuWjNSV3BTVVRKd04xcHhibmhhVTA1bloyOVJiVTVIZDFoVWFUTlhYMDV0VWpJMlZUQm5XVmhVZHlKOWZRI2R3bi1zaWcifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRW1wbG95bWVudENyZWRlbnRpYWwiXSwiaWQiOiJ1cm46dXVpZDpiOGI4OTM1NS01MTZjLTQ3YWYtYjdmMy1lNzBhOTFkZjhlMGEiLCJpc3N1ZXIiOiJkaWQ6aW9uOkVpQW1QR25ic2VVLTlvZnFkeDBlWkIyNUExNVdwX2puS1g1aEJmQ3dlT2o1MFE6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNHRjMmxuSWl3aWNIVmliR2xqUzJWNVNuZHJJanA3SW1OeWRpSTZJa1ZrTWpVMU1Ua2lMQ0pyZEhraU9pSlBTMUFpTENKNElqb2lXUzFwTTA1TmFWTmFXbFpHUVcxeFdua3hjbTE2YzBkRVZqVklSVGxaZFVsdlpGUkhkbHBXYmpZeFp5SjlMQ0p3ZFhKd2IzTmxjeUk2V3lKaGRYUm9aVzUwYVdOaGRHbHZiaUlzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0pkTENKMGVYQmxJam9pU25OdmJsZGxZa3RsZVRJd01qQWlmVjBzSW5ObGNuWnBZMlZ6SWpwYlhYMTlYU3dpZFhCa1lYUmxRMjl0YldsMGJXVnVkQ0k2SWtWcFEyb3lkbFJRWTBkZmVWVnRTV1ZrZDBkT1h6SnljbU5vUVZOWVltUkliWEE0TFdJeGVVeHBXR0pFUkdjaWZTd2ljM1ZtWm1sNFJHRjBZU0k2ZXlKa1pXeDBZVWhoYzJnaU9pSkZhVU5UVURGdFh6VlFNbmhNU1VWcVNraGpURzU1Tm5GWU5HMU9kMnhYWkdkMVUyazBTWEZOU1hNeldrWkJJaXdpY21WamIzWmxjbmxEYjIxdGFYUnRaVzUwSWpvaVJXbERVblozUldwU1VUSndOMXB4Ym5oYVUwNW5aMjlSYlU1SGQxaFVhVE5YWDA1dFVqSTJWVEJuV1ZoVWR5SjlmUSIsImlzc3VhbmNlRGF0ZSI6IjIwMjMtMTItMjdUMTg6MTI6MzlaIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6aW9uOkVpQllCbnQwbTB5NzNWMDdVOS1yZEt0VS1GZ2ViUlVoVVQ0VUxBc0pCZ3p2U2c6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNHRjMmxuSWl3aWNIVmliR2xqUzJWNVNuZHJJanA3SW1OeWRpSTZJa1ZrTWpVMU1Ua2lMQ0pyZEhraU9pSlBTMUFpTENKNElqb2lVVVJHUVhSSldUTnlVWEZCWkZSYWVrOUxPVTVhWm5jeVlsWlhNMnBKVUdkdFZXTjZiWFpwVVdFeGR5SjlMQ0p3ZFhKd2IzTmxjeUk2V3lKaGRYUm9aVzUwYVdOaGRHbHZiaUlzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0pkTENKMGVYQmxJam9pU25OdmJsZGxZa3RsZVRJd01qQWlmVjBzSW5ObGNuWnBZMlZ6SWpwYlhYMTlYU3dpZFhCa1lYUmxRMjl0YldsMGJXVnVkQ0k2SWtWcFFYTkNRbmt0V0hweVoyNUtiR2RWV25JeWRtaFpkbFJoZVc5eGJETXdTa3h4YlUxQ1kyWkNkbEZrY21jaWZTd2ljM1ZtWm1sNFJHRjBZU0k2ZXlKa1pXeDBZVWhoYzJnaU9pSkZhVU5qVEhwbVpWQkRMV3RCV1hNeVoyNWtYMDVEZVVjM1UwWlBWM2RpZEdWdFdYVjNUa2xYY0RjelNVaEJJaXdpY21WamIzWmxjbmxEYjIxdGFYUnRaVzUwSWpvaVJXbEJUMTh3Tm1OcGFTMVlRVmcyU1dadmNuUnFRVzAxU1ZaRWMyZENSMko0TjBaRlIzcGlXR0ZwUXpKNlVTSjlmUSIsImVtcGxveW1lbnRTdGF0dXMiOiJlbXBsb3llZCJ9fSwiaXNzIjoiZGlkOmlvbjpFaUFtUEduYnNlVS05b2ZxZHgwZVpCMjVBMTVXcF9qbktYNWhCZkN3ZU9qNTBROmV5SmtaV3gwWVNJNmV5SndZWFJqYUdWeklqcGJleUpoWTNScGIyNGlPaUp5WlhCc1lXTmxJaXdpWkc5amRXMWxiblFpT25zaWNIVmliR2xqUzJWNWN5STZXM3NpYVdRaU9pSmtkMjR0YzJsbklpd2ljSFZpYkdsalMyVjVTbmRySWpwN0ltTnlkaUk2SWtWa01qVTFNVGtpTENKcmRIa2lPaUpQUzFBaUxDSjRJam9pV1MxcE0wNU5hVk5hV2xaR1FXMXhXbmt4Y20xNmMwZEVWalZJUlRsWmRVbHZaRlJIZGxwV2JqWXhaeUo5TENKd2RYSndiM05sY3lJNld5SmhkWFJvWlc1MGFXTmhkR2x2YmlJc0ltRnpjMlZ5ZEdsdmJrMWxkR2h2WkNKZExDSjBlWEJsSWpvaVNuTnZibGRsWWt0bGVUSXdNakFpZlYwc0luTmxjblpwWTJWeklqcGJYWDE5WFN3aWRYQmtZWFJsUTI5dGJXbDBiV1Z1ZENJNklrVnBRMm95ZGxSUVkwZGZlVlZ0U1dWa2QwZE9Yekp5Y21Ob1FWTllZbVJJYlhBNExXSXhlVXhwV0dKRVJHY2lmU3dpYzNWbVptbDRSR0YwWVNJNmV5SmtaV3gwWVVoaGMyZ2lPaUpGYVVOVFVERnRYelZRTW5oTVNVVnFTa2hqVEc1NU5uRllORzFPZDJ4WFpHZDFVMmswU1hGTlNYTXpXa1pCSWl3aWNtVmpiM1psY25sRGIyMXRhWFJ0Wlc1MElqb2lSV2xEVW5aM1JXcFNVVEp3TjFweGJuaGFVMDVuWjI5UmJVNUhkMWhVYVROWFgwNXRVakkyVlRCbldWaFVkeUo5ZlEiLCJzdWIiOiJkaWQ6aW9uOkVpQllCbnQwbTB5NzNWMDdVOS1yZEt0VS1GZ2ViUlVoVVQ0VUxBc0pCZ3p2U2c6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNHRjMmxuSWl3aWNIVmliR2xqUzJWNVNuZHJJanA3SW1OeWRpSTZJa1ZrTWpVMU1Ua2lMQ0pyZEhraU9pSlBTMUFpTENKNElqb2lVVVJHUVhSSldUTnlVWEZCWkZSYWVrOUxPVTVhWm5jeVlsWlhNMnBKVUdkdFZXTjZiWFpwVVdFeGR5SjlMQ0p3ZFhKd2IzTmxjeUk2V3lKaGRYUm9aVzUwYVdOaGRHbHZiaUlzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0pkTENKMGVYQmxJam9pU25OdmJsZGxZa3RsZVRJd01qQWlmVjBzSW5ObGNuWnBZMlZ6SWpwYlhYMTlYU3dpZFhCa1lYUmxRMjl0YldsMGJXVnVkQ0k2SWtWcFFYTkNRbmt0V0hweVoyNUtiR2RWV25JeWRtaFpkbFJoZVc5eGJETXdTa3h4YlUxQ1kyWkNkbEZrY21jaWZTd2ljM1ZtWm1sNFJHRjBZU0k2ZXlKa1pXeDBZVWhoYzJnaU9pSkZhVU5qVEhwbVpWQkRMV3RCV1hNeVoyNWtYMDVEZVVjM1UwWlBWM2RpZEdWdFdYVjNUa2xYY0RjelNVaEJJaXdpY21WamIzWmxjbmxEYjIxdGFYUnRaVzUwSWpvaVJXbEJUMTh3Tm1OcGFTMVlRVmcyU1dadmNuUnFRVzAxU1ZaRWMyZENSMko0TjBaRlIzcGlXR0ZwUXpKNlVTSjlmUSJ9.ex6f3obHx_Mh1aab3oU5JRBoqncUEAc7o426aKpbQXDWbi_pJ98cyH0BtPKC_twXaEdNJUjuxpVNjIUyJxFuBA',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDppb246RWlBbVBHbmJzZVUtOW9mcWR4MGVaQjI1QTE1V3Bfam5LWDVoQmZDd2VPajUwUTpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0dGMybG5JaXdpY0hWaWJHbGpTMlY1U25kcklqcDdJbU55ZGlJNklrVmtNalUxTVRraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVdTMXBNMDVOYVZOYVdsWkdRVzF4V25reGNtMTZjMGRFVmpWSVJUbFpkVWx2WkZSSGRscFdiall4WnlKOUxDSndkWEp3YjNObGN5STZXeUpoZFhSb1pXNTBhV05oZEdsdmJpSXNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSmRMQ0owZVhCbElqb2lTbk52YmxkbFlrdGxlVEl3TWpBaWZWMHNJbk5sY25acFkyVnpJanBiWFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUTJveWRsUlFZMGRmZVZWdFNXVmtkMGRPWHpKeWNtTm9RVk5ZWW1SSWJYQTRMV0l4ZVV4cFdHSkVSR2NpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVTlRVREZ0WHpWUU1uaE1TVVZxU2toalRHNTVObkZZTkcxT2QyeFhaR2QxVTJrMFNYRk5TWE16V2taQklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsRFVuWjNSV3BTVVRKd04xcHhibmhhVTA1bloyOVJiVTVIZDFoVWFUTlhYMDV0VWpJMlZUQm5XVmhVZHlKOWZRI2R3bi1zaWcifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiUElJQ3JlZGVudGlhbCJdLCJpZCI6InVybjp1dWlkOjMyMTY5NTE5LWU2NTgtNGQxYi1hYzUxLTIxYjhhODI4YzYxZiIsImlzc3VlciI6ImRpZDppb246RWlBbVBHbmJzZVUtOW9mcWR4MGVaQjI1QTE1V3Bfam5LWDVoQmZDd2VPajUwUTpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0dGMybG5JaXdpY0hWaWJHbGpTMlY1U25kcklqcDdJbU55ZGlJNklrVmtNalUxTVRraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVdTMXBNMDVOYVZOYVdsWkdRVzF4V25reGNtMTZjMGRFVmpWSVJUbFpkVWx2WkZSSGRscFdiall4WnlKOUxDSndkWEp3YjNObGN5STZXeUpoZFhSb1pXNTBhV05oZEdsdmJpSXNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSmRMQ0owZVhCbElqb2lTbk52YmxkbFlrdGxlVEl3TWpBaWZWMHNJbk5sY25acFkyVnpJanBiWFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUTJveWRsUlFZMGRmZVZWdFNXVmtkMGRPWHpKeWNtTm9RVk5ZWW1SSWJYQTRMV0l4ZVV4cFdHSkVSR2NpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVTlRVREZ0WHpWUU1uaE1TVVZxU2toalRHNTVObkZZTkcxT2QyeFhaR2QxVTJrMFNYRk5TWE16V2taQklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsRFVuWjNSV3BTVVRKd04xcHhibmhhVTA1bloyOVJiVTVIZDFoVWFUTlhYMDV0VWpJMlZUQm5XVmhVZHlKOWZRIiwiaXNzdWFuY2VEYXRlIjoiMjAyMy0xMi0yN1QxODoxMjozOVoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDppb246RWlCWUJudDBtMHk3M1YwN1U5LXJkS3RVLUZnZWJSVWhVVDRVTEFzSkJnenZTZzpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0dGMybG5JaXdpY0hWaWJHbGpTMlY1U25kcklqcDdJbU55ZGlJNklrVmtNalUxTVRraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaVVVUkdRWFJKV1ROeVVYRkJaRlJhZWs5TE9VNWFabmN5WWxaWE0ycEpVR2R0VldONmJYWnBVV0V4ZHlKOUxDSndkWEp3YjNObGN5STZXeUpoZFhSb1pXNTBhV05oZEdsdmJpSXNJbUZ6YzJWeWRHbHZiazFsZEdodlpDSmRMQ0owZVhCbElqb2lTbk52YmxkbFlrdGxlVEl3TWpBaWZWMHNJbk5sY25acFkyVnpJanBiWFgxOVhTd2lkWEJrWVhSbFEyOXRiV2wwYldWdWRDSTZJa1ZwUVhOQ1Fua3RXSHB5WjI1S2JHZFZXbkl5ZG1oWmRsUmhlVzl4YkRNd1NreHhiVTFDWTJaQ2RsRmtjbWNpZlN3aWMzVm1abWw0UkdGMFlTSTZleUprWld4MFlVaGhjMmdpT2lKRmFVTmpUSHBtWlZCRExXdEJXWE15WjI1a1gwNURlVWMzVTBaUFYzZGlkR1Z0V1hWM1RrbFhjRGN6U1VoQklpd2ljbVZqYjNabGNubERiMjF0YVhSdFpXNTBJam9pUldsQlQxOHdObU5wYVMxWVFWZzJTV1p2Y25ScVFXMDFTVlpFYzJkQ1IySjROMFpGUjNwaVdHRnBReko2VVNKOWZRIiwibmFtZSI6IkFsaWNlIFNtaXRoIiwiZGF0ZU9mQmlydGgiOiIyMDAxLTEyLTIxVDE3OjAyOjAxWiJ9fSwiaXNzIjoiZGlkOmlvbjpFaUFtUEduYnNlVS05b2ZxZHgwZVpCMjVBMTVXcF9qbktYNWhCZkN3ZU9qNTBROmV5SmtaV3gwWVNJNmV5SndZWFJqYUdWeklqcGJleUpoWTNScGIyNGlPaUp5WlhCc1lXTmxJaXdpWkc5amRXMWxiblFpT25zaWNIVmliR2xqUzJWNWN5STZXM3NpYVdRaU9pSmtkMjR0YzJsbklpd2ljSFZpYkdsalMyVjVTbmRySWpwN0ltTnlkaUk2SWtWa01qVTFNVGtpTENKcmRIa2lPaUpQUzFBaUxDSjRJam9pV1MxcE0wNU5hVk5hV2xaR1FXMXhXbmt4Y20xNmMwZEVWalZJUlRsWmRVbHZaRlJIZGxwV2JqWXhaeUo5TENKd2RYSndiM05sY3lJNld5SmhkWFJvWlc1MGFXTmhkR2x2YmlJc0ltRnpjMlZ5ZEdsdmJrMWxkR2h2WkNKZExDSjBlWEJsSWpvaVNuTnZibGRsWWt0bGVUSXdNakFpZlYwc0luTmxjblpwWTJWeklqcGJYWDE5WFN3aWRYQmtZWFJsUTI5dGJXbDBiV1Z1ZENJNklrVnBRMm95ZGxSUVkwZGZlVlZ0U1dWa2QwZE9Yekp5Y21Ob1FWTllZbVJJYlhBNExXSXhlVXhwV0dKRVJHY2lmU3dpYzNWbVptbDRSR0YwWVNJNmV5SmtaV3gwWVVoaGMyZ2lPaUpGYVVOVFVERnRYelZRTW5oTVNVVnFTa2hqVEc1NU5uRllORzFPZDJ4WFpHZDFVMmswU1hGTlNYTXpXa1pCSWl3aWNtVmpiM1psY25sRGIyMXRhWFJ0Wlc1MElqb2lSV2xEVW5aM1JXcFNVVEp3TjFweGJuaGFVMDVuWjI5UmJVNUhkMWhVYVROWFgwNXRVakkyVlRCbldWaFVkeUo5ZlEiLCJzdWIiOiJkaWQ6aW9uOkVpQllCbnQwbTB5NzNWMDdVOS1yZEt0VS1GZ2ViUlVoVVQ0VUxBc0pCZ3p2U2c6ZXlKa1pXeDBZU0k2ZXlKd1lYUmphR1Z6SWpwYmV5SmhZM1JwYjI0aU9pSnlaWEJzWVdObElpd2laRzlqZFcxbGJuUWlPbnNpY0hWaWJHbGpTMlY1Y3lJNlczc2lhV1FpT2lKa2QyNHRjMmxuSWl3aWNIVmliR2xqUzJWNVNuZHJJanA3SW1OeWRpSTZJa1ZrTWpVMU1Ua2lMQ0pyZEhraU9pSlBTMUFpTENKNElqb2lVVVJHUVhSSldUTnlVWEZCWkZSYWVrOUxPVTVhWm5jeVlsWlhNMnBKVUdkdFZXTjZiWFpwVVdFeGR5SjlMQ0p3ZFhKd2IzTmxjeUk2V3lKaGRYUm9aVzUwYVdOaGRHbHZiaUlzSW1GemMyVnlkR2x2YmsxbGRHaHZaQ0pkTENKMGVYQmxJam9pU25OdmJsZGxZa3RsZVRJd01qQWlmVjBzSW5ObGNuWnBZMlZ6SWpwYlhYMTlYU3dpZFhCa1lYUmxRMjl0YldsMGJXVnVkQ0k2SWtWcFFYTkNRbmt0V0hweVoyNUtiR2RWV25JeWRtaFpkbFJoZVc5eGJETXdTa3h4YlUxQ1kyWkNkbEZrY21jaWZTd2ljM1ZtWm1sNFJHRjBZU0k2ZXlKa1pXeDBZVWhoYzJnaU9pSkZhVU5qVEhwbVpWQkRMV3RCV1hNeVoyNWtYMDVEZVVjM1UwWlBWM2RpZEdWdFdYVjNUa2xYY0RjelNVaEJJaXdpY21WamIzWmxjbmxEYjIxdGFYUnRaVzUwSWpvaVJXbEJUMTh3Tm1OcGFTMVlRVmcyU1dadmNuUnFRVzAxU1ZaRWMyZENSMko0TjBaRlIzcGlXR0ZwUXpKNlVTSjlmUSJ9.l0_H9lUbTNSZ5p1loo3n2bk8lKxmYzRoNcK6IwO3X23DNhW0b3At_goX40IjqhrN7RwFosQz-h69bJb4z6HzCA',
  ],
  warnings: [],
  errors: [],
  value: {
    id: 'bPLV_jMdN5XJengbX4M-l',
    definition_id: 'presDefIdloanAppVerification123',
    descriptor_map: [
      {
        id: 'employmentVerification',
        format: 'jwt_vc',
        path: '$.verifiableCredential[0]',
      },
      {
        id: 'dobVerification',
        format: 'jwt_vc',
        path: '$.verifiableCredential[1]',
      },
      {
        id: 'nameVerification',
        format: 'jwt_vc',
        path: '$.verifiableCredential[1]',
      },
    ],
  },
};

describe('verify presentation of credentials', () => {
  test('VerifiableCredential.verify() verifies a VC', async () => {
    const verificationResults = await verifyCredentials();
    expect(verificationResults).toEqual(expectedVerificationResults);
  });

  test('PresentationExchange.evaluatePresentation() evaluates presentation against definition', async () => {
    const evaluationResults = await evaluatePresentation();
    expect(evaluationResults).toEqual(expectedEvaluationResults);
  });
});